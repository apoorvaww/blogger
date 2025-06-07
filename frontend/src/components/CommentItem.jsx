import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { FiMoreVertical } from "react-icons/fi";
import ConfirmModal from "./ConfirmModal.jsx";

const CommentItem = ({ comment, blogId, fetchComments, depth = 0 }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getReplies = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/comments/get-replies-on-comment/${
          comment._id
        }`
      );
      setReplies(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching replies:", error);
      toast.error("Couldn't fetch replies. Try again later!");
    }
  };

  const toggleReplies = async () => {
    if (!showReplies) {
      await getReplies();
    }
    setShowReplies((prev) => !prev);
  };

  const handleReply = async () => {
    if (!replyText.trim()) return toast.error("Reply cannot be empty!");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comments/add-reply-to-comment/${
          comment._id
        }`,
        { replyContent: replyText },
        { withCredentials: true }
      );
      toast.success("Reply added!");
      setReplyText("");
      console.log(res.data.data);
      getReplies(); // Refresh replies
    } catch (error) {
      console.error("Reply failed:", error);
      toast.error(error.response?.data?.message || "Reply failed");
    }
  };

  const handleUpdate = async () => {
    if (!editText.trim()) return toast.error("Comment cannot be empty!");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comments/update-comment/${
          comment._id
        }`,
        { updatedContent: editText },
        { withCredentials: true }
      );
      toast.success("Comment updated");
      setIsEditing(false);
      fetchComments();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update comment");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comments/delete-comment/${
          comment._id
        }`,
        {},
        { withCredentials: true }
      );
      toast.success("Comment deleted");
      fetchComments();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete comment");
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <div
      className={`border border-teal-200 p-4 rounded-lg shadow-sm relative mt-4 ${
        depth > 0 ? "ml-8 border-l-4 border-teal-300" : ""
      }`}
    >
      {/* 3-dot menu */}
      <div className="absolute top-2 right-2">
        <button onClick={() => setMenuOpen((prev) => !prev)}>
          <FiMoreVertical />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-white shadow rounded z-10 text-sm border">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                setIsEditing(true);
                setMenuOpen(false);
              }}
            >
              ✏️ Edit
            </button>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              onClick={() => {
                setShowDeleteModal(true);
                setMenuOpen(false);
              }}
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>

      {/* Avatar & Username */}
      <div className="flex items-center gap-3 mb-2">
        <img
          src={comment.owner?.avatar || "https://via.placeholder.com/40"}
          alt="Avatar"
          className="w-10 h-10 rounded-full"
        />
        <span className="font-bold text-teal-800">
          {comment.owner?.username || "Anonymous"}
        </span>
      </div>

      {isEditing ? (
        <>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <div className="mt-2 flex gap-2">
            <button
              className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700"
              onClick={handleUpdate}
            >
              Save
            </button>
            <button
              className="px-3 py-1 bg-gray-300 rounded"
              onClick={() => {
                setIsEditing(false);
                setEditText(comment.content);
              }}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-800 mb-2 whitespace-pre-wrap">
          {comment.content}
        </p>
      )}

      <button
        onClick={toggleReplies}
        className="text-sm text-teal-600 font-semibold hover:underline"
      >
        {showReplies ? "Hide Replies" : "View Replies"}
      </button>

      <div className="mt-2">
        <textarea
          className="w-full p-2 border rounded text-sm"
          rows="2"
          placeholder="Write a reply..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <button
          onClick={handleReply}
          className="mt-1 px-4 py-1 text-sm bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          Reply
        </button>
      </div>

      {showReplies &&
        replies.map((reply) => (
          <CommentItem
            key={reply._id}
            comment={reply}
            blogId={blogId}
            fetchComments={fetchComments}
            depth={depth + 1}
          />
        ))}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this comment?"
      />
    </div>
  );
};

export default CommentItem;
