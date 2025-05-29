import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getPublicBlogs,
  getSingleBlog,
  updateBlog,
} from "../controllers/blog.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/create-blog-post").post(verifyJWT, createBlog);
router.route("/update-blog-post").post(verifyJWT, updateBlog);
router.route("/delete-blog-post").post(verifyJWT, deleteBlog);
router.route("/get-public-blogs").get(verifyJWT, getPublicBlogs);
router.route("/get-single-blog/:blogId").get(verifyJWT, getSingleBlog);
router.route("/get-all-blogs/:userId").get(verifyJWT, getAllBlogs);

export default router;
