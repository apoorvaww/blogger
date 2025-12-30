import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../store/authSlice";

const UpdateAccountDetails = ({}) => {
  const userData = useSelector((state) => state.auth.userData);
  console.log(userData);
  const [newUsername, setNewUsername] = useState(userData.username || "");
  const [newFullName, setNewFullName] = useState(userData.fullName || "");
  const [newEmail, setNewEmail] = useState(userData.email || "");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/update-account-details`,
        {
          username: newUsername,
          fullName: newFullName,
          email: newEmail,
        },
        {
          withCredentials: true,
        }
      );

      console.log(res.data);
      toast.success(res.data.message || "Account details updated successfully");
      dispatch(login(res.data.data));
      navigate(`/profile/u/${userData._id}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update account details"
      );
      console.error("Error while updating account details:", error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl max-w-md mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Update Account Details
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="newUsername"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            New Username
          </label>
          <input
            type="text"
            id="newUsername"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Enter new username"
          />
        </div>

        <div>
          <label
            htmlFor="newFullName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            New Full Name
          </label>
          <input
            type="text"
            id="newFullName"
            value={newFullName}
            onChange={(e) => setNewFullName(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Enter new full name"
          />
        </div>

        {/* Email Input */}
        <div>
          <label
            htmlFor="newEmail"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            New Email
          </label>
          <input
            type="email" // Use type="email" for better validation
            id="newEmail"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="Enter new email"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setNewUsername(userData.username || "");
              setNewFullName(userData.fullName || "");
              setNewEmail(userData.email || "");
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Updating..." : "Update Details"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateAccountDetails;
