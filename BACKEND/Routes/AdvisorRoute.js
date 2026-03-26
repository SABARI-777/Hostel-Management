import express from "express";

import {
  AddAdvisor,
  getAdvisor,
  DeleteAdvisor,
  UpdateAdvisor,
} from "../Controllers/AdvisorController.js";
import { GetAdvisorStudents } from "../Controllers/AdvisorDashboardController.js";

import { authenticateToken } from "../Middleware/AuthMiddleware.js";
const AdvisorRouter = express.Router();

AdvisorRouter.post("/a/students", authenticateToken, GetAdvisorStudents);
AdvisorRouter.post("/a/add", AddAdvisor);
AdvisorRouter.get("/a/details", getAdvisor);
AdvisorRouter.patch("/a/update", UpdateAdvisor);
AdvisorRouter.delete("/a/delete", DeleteAdvisor);

export default AdvisorRouter;
