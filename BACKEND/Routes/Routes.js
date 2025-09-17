import express from "express";

import Userrouter from "./UserRoutes.js";
import StudentRouter from "./StudentRoute.js";
import CaretakerRouter from "./Caretakerroute.js";
import DepartmentRouter from "./DepartmentRoute.js";
import AdvisorRouter from "./AdvisorRoute.js";
import RoomRouter from "./RoomRoute.js";
import AttendanceRouter from "./Attendaceroute.js";
import PlacementAttendanceRouter from "./PlacementAttendanceRoute.js";
import BatchRouter from "./PlacementRoute.js";
import OutPassRouter from "./OutpassRouter.js";
import EmergencypassRoute from "./EmergencyRoute.js";
import GenralpassRoute from "./GenralPassRoute.js";
const Routes = express.Router();

Routes.use("/student", StudentRouter);
Routes.use("/caretaker", CaretakerRouter);

// ADMIN ROUTERS

Routes.use("/Admin", Userrouter);

Routes.use("/Admin", CaretakerRouter);

Routes.use("/Admin", DepartmentRouter);
Routes.use("/Admin", AdvisorRouter);

// admin for rooms
Routes.use("/Admin", RoomRouter);

Routes.use("/Admin", BatchRouter);

Routes.use("/Admin", StudentRouter);

Routes.use("/Admin", AttendanceRouter);

Routes.use("/Admin", PlacementAttendanceRouter);

Routes.use("/Admin", OutPassRouter);

Routes.use("/Admin", GenralpassRoute);

Routes.use("/Admin", EmergencypassRoute);
export default Routes;
