import express from "express";
import {
   createEmergencyPass,
   updateEmergencyPass,
   deleteEmergencyPass,
   getEmergencyPassDetails
} from "../Controllers/EmergencyPassController.js";
import { authenticateToken } from "../Middleware/AuthMiddleware.js";
const EmergencypassRoute = express.Router();

EmergencypassRoute.post("/e/entry/add", authenticateToken, createEmergencyPass);
EmergencypassRoute.get("/e/entry/details", authenticateToken, getEmergencyPassDetails);
EmergencypassRoute.patch("/e/entry/update", authenticateToken, updateEmergencyPass);
EmergencypassRoute.delete("/e/entry/delete", authenticateToken, deleteEmergencyPass);

export default EmergencypassRoute;
