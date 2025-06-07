import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import CommentItem from "./CommentItem";

const Comment = ({ blogId }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [showReplies, setShowReplies] = useState({});

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/comments/get-comments-on-blog/${blogId.id}`
      );
      console.log("comments:", res.data.data);
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
    if (!commentText.trim()) return toast.error("Comment cannot be empty!");
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
      toast.error(error.response?.data?.message || "Failed to add comment.");
    }
  };

  return (
    <div className="mt-16 max-w-3xl mx-auto">
      <h2 className="text-3xl font-extrabold text-teal-800 mb-8 text-center">
        💬 Comments ({comments.length})
      </h2>

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
            >
              
              <CommentItem comment={comment} blogId={blogId} fetchComments={fetchComments} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
