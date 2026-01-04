import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import {errorHandler} from './middleware/error.middleware.js'


const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes:
import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";
import commentRouter from "./routes/comment.routes.js"
import aiRouter from './routes/ai.routes.js'

//routes declaration:
app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/comments", commentRouter);
app.use('/api/ai', aiRouter);

app.use(errorHandler);

export { app };
