import express from "express";

import {
  AddDepartment,
  DeleteDepartment,
  GetDepartments,
  UpdateDepartment,
} from "../Controllers/DepartmentController.js";

const DepartmentRouter = express.Router();

DepartmentRouter.post("/department/add", AddDepartment);
DepartmentRouter.get("/department/details", GetDepartments);
DepartmentRouter.patch("/department/update", UpdateDepartment);
DepartmentRouter.delete("/department/delete", DeleteDepartment);

export default DepartmentRouter;
