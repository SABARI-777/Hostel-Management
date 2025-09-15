import express from "express";

import Userrouter from "./UserRoutes.js";
import StudentRouter from "./StudentRoute.js";
import LoginRouter from "./LoginRoute.js";
import CaretakerRouter from "./Caretakerroute.js";
import DepartmentRouter from "./DepartmentRoute.js";

const Routes = express.Router();

Routes.use("/user", Userrouter);
Routes.use("/login", LoginRouter);
Routes.use("/student", StudentRouter);
Routes.use("/caretaker", CaretakerRouter);

// ADMIN ROUTERS

Routes.use("/Admin", Userrouter);
Routes.use("/Admin", CaretakerRouter);
Routes.use("/Admin", DepartmentRouter);

export default Routes;
