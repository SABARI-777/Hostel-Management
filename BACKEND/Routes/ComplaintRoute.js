import express from "express";
import {
  submitComplaint,
  getStudentComplaints,
  getAdminComplaints,
  resolveComplaint
} from "../Controllers/ComplaintController.js";
import { authorizeRoles } from "../Middleware/AuthMiddleware.js";

const router = express.Router();

// Submit complaint (STUDENT)
router.post("/submit", authorizeRoles("STUDENT"), submitComplaint);

// Get student's own complaints (STUDENT)
router.get("/student", authorizeRoles("STUDENT"), getStudentComplaints);

// Get all complaints (ADMIN, CARETAKER)
router.get("/", authorizeRoles("ADMIN", "CARETAKER"), getAdminComplaints);

// Resolve a complaint (ADMIN)
router.put("/:id/resolve", authorizeRoles("ADMIN"), resolveComplaint);

export default router;
