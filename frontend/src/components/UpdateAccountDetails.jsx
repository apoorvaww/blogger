import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// This component is designed to be displayed within a modal or as a conditional render.
// It receives `userId` (though the provided logic uses a generic update endpoint,
// userId might be implicitly handled by backend session/cookies) and `onClose` to close itself.
const UpdateAccountDetails = ({ userId, onClose }) => {
  // Renamed from UpdateUsername to reflect broader functionality
  const [newUsername, setNewUsername] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // The handleSubmit function now aligns with the user's provided logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Using axios.post as per user's provided logic for updating account details
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/update-account-details`,
        {
          username: newUsername,
          fullName: newFullName,
          email: newEmail,
        },
        {
          withCredentials: true, // Ensure cookies are sent
        }
      );

      console.log(res.data);
      // Using res.data.message if available, otherwise a generic success message
      toast.success(res.data.message || "Account details updated successfully");
      onClose(); // Close the modal on successful update
    } catch (error) {
      // Displaying error message from backend if available, otherwise a generic error
      toast.error(
        error.response?.data?.message || "Failed to update account details"
      );
      console.error("Error while updating account details:", error);
    } finally {
      setLoading(false); // Always reset loading state
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl max-w-md mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Update Account Details
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username Input */}
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
            // You can make this required if a username is always necessary
          />
        </div>

        {/* Full Name Input */}
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
            // You can make this required
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
            // You can make this required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Details"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateAccountDetails;
