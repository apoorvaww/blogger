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
  const { page = 1, limit = 10, keyword } = req.query;

  if (!blogId) {
    throw new ApiError(400, "Blog id is required");
  }

  const skip = (page - 1) * limit;
  let query = {blog: blogId, isDeleted: false};

  if(keyword) {
    query.content = {$regex: keyword, $options: "i"};
  }

  const totalComments = await Comment.countDocuments(query);

  const comments = await Comment.find(query)
    .populate("owner", "username avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  if (comments.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, comments, "No comments found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
        comments,
        totalComments,
        totalPages: Math.ceil(totalComments/limit),
        currentPage: parseInt(page)
        },
        "Comments under blog post fetched successfully"
      )
    );
});

const addReplyToComment = asyncHandler(async(req, res) => {
  const {parentCommentId} = req.params;
  const {replyContent} = req.body;
  if(!parentCommentId) {
    throw new ApiError(400, "Parent comment id is required");
  };
  if(!content){
    throw new ApiError(400, "content of comment is required");
  }

  const parentComment = await Comment.findById(parentCommentId);
  if(!parentComment) {
    throw new ApiError(404, "Parent Comment not found");
  }

  const reply = await Comment.create({
    content: replyContent,
    blog: parentComment.blog,
    owner: req.user._id,
    parentComment: parentComment._id
  })

  if(!reply) {
    throw new ApiError(500, "Something went wrong. Reply couldn't be added.")
  }

  return res
  .status(201)
  .json(new ApiResponse(201, reply, "Reply added successfully"))


})

const getRepliesOnComment = asyncHandler(async(req, res) => {
  const {parentCommentId} = req.params;
  if(!parentCommentId) {
    throw new ApiError(400, "Parent comment's id is required");
  }

  const replies = await Comment.find({parentComment: parentCommentId})
  .populate("owner", "username avatar")
  .sort({createdAt: -1});

  if(replies.length === 0) {
    return res.status(200).json(new ApiResponse(200, replies, "No replies added yet."))
  }

  return res
  .status(200)
  .json(new ApiResponse(200, replies, "Replies fetched successfully"));
});

const deleteReplyOnComment = asyncHandler(async(req, res) => {
  const {replyId} = req.params;
  if(!replyId) {
    throw new ApiError(400, "Reply id is required")
  }

  const reply = await Comment.findById(replyId);
  if(!reply) {
    throw new ApiError(404, "Reply not found");
  }

  if(!reply.parentComment) {
    throw new ApiError(400, "This comment is not reply");
  }

  if(reply.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this reply");
  }

  reply.isDeleted = true;
  await reply.save();

  return res
  .status(200)
  .json(new ApiResponse(200, reply, "Reply deleted successfully"))

})

export { createComment, updateComment, deleteComment, getCommentsOnBlog, getRepliesOnComment, addReplyToComment, deleteReplyOnComment };
