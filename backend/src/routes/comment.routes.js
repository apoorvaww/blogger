import Router from "express";
import {
  addReplyToComment,
  createComment,
  deleteComment,
  deleteReplyOnComment,
  getCommentsOnBlog,
  getRepliesOnComment,
  updateComment,
} from "../controllers/comment.controller.js";
import {verifyJWT} from "../middleware/auth.middleware.js";

const router = Router();

router.route("/create-comment/:blogId").post(verifyJWT, createComment);
router.route("/update-comment/:commentId").post(verifyJWT, updateComment);
router.route("/delete-comment/:commentId").post(verifyJWT, deleteComment);
router
  .route("/add-reply-to-comment/:parentCommentId")
  .post(verifyJWT, addReplyToComment);
router
  .route("/delete-reply-to-comment/:replyId")
  .post(verifyJWT, deleteReplyOnComment);
router.route("/get-comments-on-blog/:blogId").get(getCommentsOnBlog);
router
  .route("/get-replies-on-comment/:parentCommentId")
  .get(getRepliesOnComment);

export default router;
