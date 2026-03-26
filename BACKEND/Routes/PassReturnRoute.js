import express from "express";
import { ProcessPassReturn, GetPassByUniqueId } from "../Controllers/PassReturnController.js";
import { authenticateToken } from "../Middleware/AuthMiddleware.js";
const router = express.Router();

router.post("/pass/return", authenticateToken, ProcessPassReturn);
router.get("/pass/details/:PassId", authenticateToken, GetPassByUniqueId);

export default router;
