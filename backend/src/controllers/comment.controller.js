import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Comment } from "../models/comment.model.js";
import { Blog } from "../models/blog.model.js";

const createComment = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { content } = req.body;

  if (!blogId) {
    throw new ApiError(400, "Blog id is required to add comment");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Comment can't be empty");
  }

  const comment = await Comment.create({
    content: content,
    blog: blogId,
    owner: req.user?._id,
  });

  if (!comment) {
    throw new ApiError(500, "Couln't create comment");
  }

  await Blog.findByIdAndUpdate(blogId, { $inc: { commentsCount: 1 } });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment created successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { updatedContent } = req.body;
  const { commentId } = req.params;

  if (!updatedContent || updatedContent.trim() === "") {
    throw new ApiError(400, "updated comment cannot be empty");
  }
  if (!commentId) {
    throw new ApiError(400, "Comment id is required");
  }

  const comment = Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment to be updated not found");
  }

  if (comment.owner.toString() !== req.user._id) {
    throw new ApiError(403, "you are not authenticated to edit this comment");
  }

  comment.content = updatedContent.trim();
  comment.isEdited = true;
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(400, "Comment id is required");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  if (comment.owner.toString() !== req.user._id) {
    throw new ApiError(403, "You are not authenticated to delete this comment");
  }

  comment.isDeleted = true;
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment deleted successfully"));
});

const getCommentsOnBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  if (!blogId) {
    throw new ApiError(400, "Blog id is required");
  }

  const comments = await Comment.find({ blog: blogId, isDeleted: false})
  .populate("owner", "username avatar")
  .sort({createdAt: -1});
  if(!comments) {
    throw new ApiError(404, "Couldn't get comments");
  }

  return res
  .status(200)
  .json(new ApiResponse(200, comments, "Comments under blog post fetched successfully"))
});

export { createComment, updateComment, deleteComment };
