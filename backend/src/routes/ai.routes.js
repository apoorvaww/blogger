import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { summarize } from "../controllers/ai.controller.js";

const router = Router();

router.route('/summarize-blog').post(summarize);

export default router;