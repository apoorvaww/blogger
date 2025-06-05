import React, { useState } from "react";

const CommentItem = ({ comment, onReply }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onReply(comment._id, replyText);
      setReplyText("");
      setShowReplyInput(false);
    }
  };
  // console.log("comment on commentitem: ", comment);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-300">
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
          {comment.owner?.username?.charAt(0) || "U"}
        </div>
        <div>
          <p className="font-semibold text-gray-800">
            {comment.owner?.username || "Anonymous"}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <p className="text-gray-900 mb-3">{comment.content}</p>

      <button
        onClick={() => setShowReplyInput(!showReplyInput)}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        {showReplyInput ? "Cancel Reply" : "Reply"}
      </button>

      {showReplyInput && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
            rows="2"
            placeholder={`Reply to ${comment.owner?.username || "this comment"}...`}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          ></textarea>
          <button
            onClick={handleReplySubmit}
            className="mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md"
          >
            Post Reply
          </button>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 mt-4 border-l-2 border-gray-200 pl-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply._id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
