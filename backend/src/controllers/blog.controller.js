import { Blog } from "../models/blog.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createBlog = asyncHandler(async (req, res, next) => {
  try {
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

    const blog = await Blog.create({
      title: title,
      content,
      coverImage: coverImageUrl,
      owner: req.user?._id,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, { blog: blog }, "blog post created successfully")
      );
  } catch (error) {
    next(error);
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const {title, content} = req.body || {};
  const { blogId } = req.params;

  // if (!title) {
  //   throw new ApiError(400, "title to update not found");
  // }
  // if (!content) {
  //   throw new ApiError(400, "updated content not found");
  // }

  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new ApiError(400, "blog id not found");
  }
  console.log(blog);

  if (blog.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(409, "unauthenticated request to update blog.");
  }

  if(title && title!=blog.title) blog.title = title;
  if(content && content != blog.content) blog.content = content;

  const newCoverImagePath = req.files?.coverImage?.[0]?.path;

  if (newCoverImagePath) {
    const newCoverImage = await uploadOnCloudinary(newCoverImagePath);
    if (newCoverImage) {
      blog.coverImage = newCoverImage.url;
    } else {
      throw new ApiError(400, "couldn't upload new cover image.");
    }
  }

  const updatedBlog = await blog.save();
  console.log(updatedBlog);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedBlog, "blog updated successfully"));
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  if (!blogId) {
    throw new ApiError(404, "couldn't fetch the backend id");
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (blog.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(409, "You are not authenticated for this request.");
  }

  blog.isDeleted = true;
  await blog.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "blog deleted successfully"));
});

const getAllBlogs = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "Couldn't fetch user id from request");
  }
  const blogs = await Blog.find({
    owner: userId,
  })
    .sort({ createdAt: -1 })
    .populate("owner", "username email avatar");

  if (!blogs) {
    throw new ApiError(404, "No blogs found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, blogs, "Blogs fetched successfully"));
});

const getSingleBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  if (!blogId) {
    throw new ApiError(400, "Blog id is required");
  }
  const blog = await Blog.findById(blogId).populate(
    "owner",
    "username email avatar"
  );
  if (!blog) {
    throw new ApiError(400, "blog not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, blog, "blog sent successfully"));
});

const getPublicBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({
    isDeleted: { $ne: true },
  })
    .populate({
      path: "owner",
      select: "username email isPublic avatar",
      match: { isPublic: true },
    })
    .sort({
      createdAt: -1,
    })
    .lean();

  if (!blogs) {
    throw new ApiError(500, "No blogs to show yet");
  }

  const publicBlogs = blogs.filter((blog) => blog.owner !== null);

  if (!publicBlogs) {
    throw new ApiError(404, "Couldn't fetch public blogs");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { total: publicBlogs.length, blogs: publicBlogs },
        "Public blogs fetched successfully"
      )
    );
});

export {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getSingleBlog,
  getPublicBlogs,
};
