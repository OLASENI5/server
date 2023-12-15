import express from "express";
const router = express.Router();
import { createComment } from "../controllers/commentController.js";
import { authGuard } from "../middleware/authMiddleware.js";

router.post("/", authGuard, createComment);

export default router;
