import express from "express";
import {
   createEmergencyPass,
   updateEmergencyPass,
   deleteEmergencyPass,
   getEmergencyPassDetails
} from "../Controllers/EmergencyPassController.js";
const EmergencypassRoute = express.Router();

EmergencypassRoute.post("/e/entry/add", createEmergencyPass);
EmergencypassRoute.get("/e/entry/details", getEmergencyPassDetails);
EmergencypassRoute.patch("/e/entry/update", updateEmergencyPass);
EmergencypassRoute.delete("/e/entry/delete", deleteEmergencyPass);

export default EmergencypassRoute;
