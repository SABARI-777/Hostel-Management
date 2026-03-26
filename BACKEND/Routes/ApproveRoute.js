import express from "express";
import { MakeApprove,CancelApprove, MarkEntry } from "../Controllers/Caretakerapprovel.js";
import { authenticateToken } from "../Middleware/AuthMiddleware.js";

const ApprovealRouter = express.Router();

ApprovealRouter.post("/approve/", authenticateToken, MakeApprove);
ApprovealRouter.post("/cancel/", authenticateToken, CancelApprove);
ApprovealRouter.post("/mark-entry/", authenticateToken, MarkEntry);
export default ApprovealRouter;
