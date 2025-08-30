import dotenv from "dotenv";
import dbConnect from "./db/index.js";
import { app } from "./app.js";

dotenv.config(); // works locally, Render injects env vars in prod

const PORT = process.env.PORT || 8000;

dbConnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running at port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
