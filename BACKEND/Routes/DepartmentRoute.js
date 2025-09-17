import express from "express";

import {
  AddDepartment,
  DeleteDepartment,
  GetDepartments,
  UpdateDepartment,
} from "../Controllers/DepartmentController.js";

const DepartmentRouter = express.Router();

DepartmentRouter.post("/d/add", AddDepartment);
DepartmentRouter.get("/d/details", GetDepartments);
DepartmentRouter.patch("/d/update", UpdateDepartment);
DepartmentRouter.delete("/d/delete", DeleteDepartment);

export default DepartmentRouter;
