import React, { useState, useRef } from "react"; // Import useRef
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../store/authSlice"; // Removed unused 'logout'

const UpdateAvatar = () => {
  const userData = useSelector((state) => state.auth.userData);
  console.log(userData);

  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!userData) {
      toast.error("Please log in to update your avatar.");
      navigate("/login"); // Redirect to login page
    }
  }, [userData, navigate]);

  const handleFileChange = (e) => {
    setSelectedAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAvatar) {
      toast.error("Please select an avatar file.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("avatar", selectedAvatar); // 'avatar' must match your backend's Multer field name

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/users/update-user-avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Essential for file uploads
          },
          withCredentials: true,
        }
      );

      console.log("after updating: ", res.data.data);
      toast.success(res.data.message || "Avatar updated successfully");
      dispatch(login(res.data.data));

      if (userData?._id) {
        navigate(`/profile/u/${userData._id}`);
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update avatar. Please try again."
      );
      console.error("Error while updating avatar:", error);
    } finally {
      setLoading(false);
      setSelectedAvatar(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center  bg-gray-100">
        <div className="text-center py-8 text-gray-700">
          Loading user data or redirecting...
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-90 bg-gray-100">
      <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-5">
          Update Avatar
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {" "}
          {userData.avatar && (
            <div className="flex justify-center mb-4">
              <img
                src={userData.avatar}
                alt="Current Avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-teal-300 shadow-md"
              />
            </div>
          )}
          <div>
            <label
              htmlFor="newAvatar"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select New Avatar
            </label>
            <input
              type="file"
              id="newAvatar"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm
                                       file:mr-4 file:py-2 file:px-4
                                       file:rounded-md file:border-0
                                       file:text-sm file:font-semibold
                                       file:bg-indigo-50 file:text-teal-700
                                       hover:file:bg-indigo-100 cursor-pointer"
              accept="image/*"
            />
            {selectedAvatar && (
              <p className="mt-2 text-sm text-gray-600">
                Selected file:{" "}
                <span className="font-semibold">{selectedAvatar.name}</span>
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            {" "}
            <button
              type="button"
              onClick={() => {
                setSelectedAvatar(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedAvatar}
              className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200 "
            >
              {loading ? "Updating..." : "Update Avatar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAvatar;
