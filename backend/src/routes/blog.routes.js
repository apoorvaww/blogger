import { Router } from "express";
import {createBlog} from '../controllers/blog.controller.js'
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/create-blog-post").post(verifyJWT, createBlog)

export default router;