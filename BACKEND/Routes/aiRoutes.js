import express from "express";
import { chatWithAI } from "../Controllers/aiController.js";
import { authenticateToken } from "../Middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/chat", authenticateToken, chatWithAI);

export default router;