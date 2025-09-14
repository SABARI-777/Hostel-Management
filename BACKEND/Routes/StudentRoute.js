import express from "express";

import { CreateNewStudent,GetStudent,GetStudentByID,DeleteStudent,UpdateStudent } from "../Controllers/StudentController.js";
const StudentRouter = express.Router();

StudentRouter.post("/add/student", CreateNewStudent);
StudentRouter.get("/get/students", GetStudent);
StudentRouter.get("/get/student/", GetStudentByID);
StudentRouter.patch("/get/update", UpdateStudent);
StudentRouter.delete("/delete/student/",DeleteStudent);


export default StudentRouter;
