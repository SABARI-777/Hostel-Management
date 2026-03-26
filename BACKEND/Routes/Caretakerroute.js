import express from "express";

import {
  CreateNewCaretaker,
  GetCaretakers,
  GetCaretakerByID,
  DeleteCaretaker,
  UpdateCaretaker,
  UpdateCaretakerProfile,
} from "../Controllers/CaretakeController.js";
import { 
  GetCaretakerDashboardStats, 
  GetCaretakerStudentsList, 
  GetCaretakerPassesList, 
  GetCaretakerAttendanceLogs, 
  GetCaretakerPlacementAttendanceLogs 
} from "../Controllers/CaretakerDashboardController.js";
import { CreateNewStudent, UpdateStudent, DeleteStudent } from "../Controllers/StudentController.js";
import { EntryAttendance, UpdateAttendance, DeleteAttendance } from "../Controllers/Attendancecontroller.js";
import { PlacementEntryAttendance, UpdatePlacementAttendance, DeletePlacementAttendance } from "../Controllers/PlacementAttendaceController.js";



import { authenticateToken, authorizeRoles } from "../Middleware/AuthMiddleware.js";
const CaretakerRouter = express.Router();

// caretaker routes
CaretakerRouter.post("/profile/details", authenticateToken, GetCaretakerByID);

// admin routes
CaretakerRouter.post("/ct/add/", authenticateToken, authorizeRoles("ADMIN"), CreateNewCaretaker);
CaretakerRouter.get("/ct/details/", authenticateToken, authorizeRoles("ADMIN", "STUDENT", "CARETAKER"), GetCaretakers);
CaretakerRouter.patch("/ct/update/", authenticateToken, authorizeRoles("ADMIN"), UpdateCaretaker);
CaretakerRouter.delete("/ct/delete/", authenticateToken, authorizeRoles("ADMIN"), DeleteCaretaker);

// Dashboard stats for Caretaker
CaretakerRouter.post("/dashboard/stats", authenticateToken, authorizeRoles("CARETAKER", "ADMIN"), GetCaretakerDashboardStats);
CaretakerRouter.post("/students", authenticateToken, authorizeRoles("CARETAKER", "ADMIN"), GetCaretakerStudentsList);
CaretakerRouter.post("/passes", authenticateToken, authorizeRoles("CARETAKER", "ADMIN"), GetCaretakerPassesList);
CaretakerRouter.post("/attendance", authenticateToken, authorizeRoles("CARETAKER", "ADMIN"), GetCaretakerAttendanceLogs);
CaretakerRouter.post("/placement-attendance", authenticateToken, authorizeRoles("CARETAKER", "ADMIN"), GetCaretakerPlacementAttendanceLogs);

// Profile & Student CRUD
CaretakerRouter.post("/update-profile", authenticateToken, UpdateCaretakerProfile);
CaretakerRouter.post("/student/add", authenticateToken, CreateNewStudent);
CaretakerRouter.post("/student/update", authenticateToken, UpdateStudent);
CaretakerRouter.post("/student/delete", authenticateToken, DeleteStudent);

// Attendance CRUD
CaretakerRouter.post("/attendance/add", authenticateToken, EntryAttendance);
CaretakerRouter.post("/attendance/update", authenticateToken, UpdateAttendance);
CaretakerRouter.post("/attendance/delete", authenticateToken, DeleteAttendance);

// Placement Attendance CRUD
CaretakerRouter.post("/placement-attendance/add", authenticateToken, PlacementEntryAttendance);
CaretakerRouter.post("/placement-attendance/update", authenticateToken, UpdatePlacementAttendance);
CaretakerRouter.post("/placement-attendance/delete", authenticateToken, DeletePlacementAttendance);

CaretakerRouter.get("/test", (req, res) => res.send("Caretaker Route Working"));

export default CaretakerRouter;
