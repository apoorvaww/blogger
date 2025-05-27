import { Blog } from "../models/blog.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createBlog = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title) {
    throw new ApiError(400, "title is required");
  }
  if (!content) {
    throw new ApiError(400, "content is required");
  }

  const coverImagePath = req.files?.coverImage[0]?.path;
  let coverImageUrl = null;

  if (coverImagePath) {
    const coverImage = await uploadOnCloudinary(coverImagePath);
    if (!coverImage.url) {
      throw new ApiError(500, "error while uploading cover image.");
    }
    coverImageUrl = coverImage.url;
  }

  const blog = Blog.create({
    title: title,
    content,
    coverImage: coverImageUrl,
    owner: req.user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, blog, "blog post created successfully"));
});

const updateBlog = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const { blogId } = req.params;

  if (!title) {
    throw new ApiError(400, "title to update not found");
  }
  if (!content) {
    throw new ApiError(400, "updated content not found");
  }

  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new ApiError(400, "blog id not found");
  }

  if (blog.owner.toString() !== req.user) {
    throw new ApiError(409, "unauthenticated request to update blog.");
  }

  const newCoverImagePath = req.files?.coverImage[0]?.path;

  if (newCoverImagePath) {
    const newCoverImage = await uploadOnCloudinary(newCoverImagePath);
    if (newCoverImage) {
      blog.coverImage = newCoverImage.url;
    } else {
      throw new ApiError(400, "couldn't upload new cover image.");
    }
  }

  blog.title = title;
  blog.content = content;

  await blog.save();

  return res
    .status(200)
    .json(new ApiResponse(200, blog, "updated blog post successfully."));
});

export { createBlog, updateBlog };
