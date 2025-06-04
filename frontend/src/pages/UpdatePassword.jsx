import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UNSAFE_ErrorResponseImpl, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../store/authSlice.js";

const UpdatePassword = () => {
  const currentUserData = useSelector((state) => state.auth.userData);
//   console.log("user data", currentUserData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    if (!currentUserData) {
      toast.error("Please log in to update password");
      navigate("/login");
    }
  }, [currentUserData, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirm password are not same");
      return;
    }

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill in all the fields");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/change-password`,
        {
          oldPassword,
          newPassword,
        },
        {
          withCredentials: true,
        }
      );

      console.log(res.data);
      if (res.data) {
        toast.success("Changed password successfully");
        dispatch(login(res.data.data));
        navigate(`/profile/u/${currentUserData._id}`);
      }
    } catch (error) {
      console.error("error changing password", error);
      const errorMessage =
        error.response?.data?.message || "Failed to change password";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Update Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {" "}
          <div>
            <label
              htmlFor="oldPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Old Password
            </label>
            <input
              type="password"
              id="oldPassword"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirmNewPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
