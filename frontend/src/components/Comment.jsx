import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Comment = ({ blogId }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [showReplies, setShowReplies] = useState({}); // Track which comments show replies

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/comments/get-comments-on-blog/${blogId.id}`
      );
      const fetchedComments = res.data?.data?.comments || [];
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const handleSubmit = async () => {
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comments/create-comment/${blogId.id}`,
        { content: commentText },
        { withCredentials: true }
      );
      toast.success("Comment added successfully!");
      setCommentText("");
      fetchComments();
    } catch (error) {
      console.error("Error creating comment:", error);
      const errResponse = error.response?.data?.message;
      toast.error(errResponse || "Failed to add comment.");
    }
  };

  const handleReply = async (parentId) => {
    const replyContent = replyText[parentId]?.trim();
    if (!replyContent) {
      toast.error("Reply cannot be empty!");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comments/add-reply-to-comment/${parentId}`,
        { replyContent: replyContent },
        { withCredentials: true }
      );
      toast.success("Reply added successfully!");
      setReplyText((prev) => ({ ...prev, [parentId]: "" }));
      fetchComments();
    } catch (error) {
      console.error("Error adding reply:", error);
      const errResponse = error.response?.data?.message;
      toast.error(errResponse || "Failed to add reply.");
    }
  };

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  return (
    <div className="mt-16 max-w-3xl mx-auto">
      <h2 className="text-3xl font-extrabold text-teal-800 mb-8 text-center">
        💬 Comments ({comments.length})
      </h2>

      {/* New Comment Input */}
      <div className="mb-10">
        <textarea
          className="w-full p-4 border border-teal-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          rows="4"
          placeholder="Write your comment here..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        ></textarea>
        <button
          onClick={handleSubmit}
          className="mt-3 px-6 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition duration-300"
        >
          ➕ Post Comment
        </button>
      </div>

      {/* Comments List */}
      {loading ? (
        <p className="text-center text-gray-600">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="border border-teal-200 p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center space-x-3 mb-2">
                <img
                  src={
                    comment.owner?.avatar || "https://via.placeholder.com/40"
                  }
                  alt="Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-bold text-teal-800">
                  {comment.owner?.username || "Anonymous"}
                </span>
              </div>
              <p className="text-gray-800 mb-3">{comment.content}</p>

              {/* Show Replies Button */}
              {comment.replies && comment.replies.length > 0 && (
                <button
                  onClick={() => toggleReplies(comment._id)}
                  className="text-sm font-semibold text-teal-600 hover:underline mb-3"
                >
                  {showReplies[comment._id] ? "Hide Replies" : `Show Replies (${comment.replies.length})`}
                </button>
              )}

              {/* Replies List (conditionally rendered) */}
              {showReplies[comment._id] && comment.replies && (
                <div className="pl-8 border-l-2 border-teal-300 space-y-4">
                  {comment.replies.map((reply) => (
                    <div
                      key={reply._id}
                      className="bg-teal-50 p-3 rounded shadow-sm"
                    >
                      <div className="flex items-center space-x-3 mb-1">
                        <img
                          src={reply.owner?.avatar || "https://via.placeholder.com/30"}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="font-semibold text-teal-700">
                          {reply.owner?.username || "Anonymous"}
                        </span>
                      </div>
                      <p className="text-gray-700">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Box */}
              <div className="mt-3">
                <textarea
                  className="w-full p-2 border border-gray-300 rounded focus:ring-teal-400"
                  rows="2"
                  placeholder="Write a reply..."
                  value={replyText[comment._id] || ""}
                  onChange={(e) =>
                    setReplyText((prev) => ({
                      ...prev,
                      [comment._id]: e.target.value,
                    }))
                  }
                ></textarea>
                <button
                  onClick={() => handleReply(comment._id)}
                  className="mt-2 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                >
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
