import express from "express";

import {
  CreateNewStudent,
  GetStudent,
  GetStudentByUserID,
  DeleteStudent,
  UpdateStudent,
} from "../Controllers/StudentController.js";
import { authenticateToken } from "../Middleware/AuthMiddleware.js";
const StudentRouter = express.Router();

StudentRouter.post("/add/student", authenticateToken, CreateNewStudent);
StudentRouter.get("/student/details", authenticateToken, GetStudent); // For Admin/Caretaker list view
StudentRouter.get("/student/profile", authenticateToken, GetStudentByUserID); // For Student profile view
// StudentRouter.get("/get/student/", GetStudentByID);
StudentRouter.patch("/student/update", UpdateStudent);
StudentRouter.delete("/student/delete/", DeleteStudent);

export default StudentRouter;
