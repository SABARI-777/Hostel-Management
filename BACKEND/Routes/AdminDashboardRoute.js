import express from "express";
import { GetAdminStats } from "../Controllers/AdminDashboardController.js";

import { authenticateToken, authorizeRoles } from "../Middleware/AuthMiddleware.js";
const AdminDashboardRouter = express.Router();
AdminDashboardRouter.get("/stats/overview", authenticateToken, authorizeRoles("ADMIN"), GetAdminStats);

export default AdminDashboardRouter;
