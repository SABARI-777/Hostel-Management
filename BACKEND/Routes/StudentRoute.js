import express from "express";

import {
  CreateNewStudent,
  GetStudent,
  DeleteStudent,
  UpdateStudent,
} from "../Controllers/StudentController.js";
const StudentRouter = express.Router();

StudentRouter.post("/add/student", CreateNewStudent);
StudentRouter.get("/student/details", GetStudent);
// StudentRouter.get("/get/student/", GetStudentByID);
StudentRouter.patch("/student/update", UpdateStudent);
StudentRouter.delete("/student/delete/", DeleteStudent);

export default StudentRouter;
