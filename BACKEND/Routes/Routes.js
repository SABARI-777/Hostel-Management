import express from "express";

import Userrouter from "./UserRoutes.js";
import StudentRouter from "./StudentRoute.js";
import LoginRouter from "./LoginRoute.js";
import CaretakerRouter from "./Caretakerroute.js";

const Routes = express.Router();

Routes.use("/user", Userrouter);
Routes.use("/login", LoginRouter);
Routes.use("/student/", StudentRouter);
Routes.use("/caretaker", CaretakerRouter);

export default Routes;
