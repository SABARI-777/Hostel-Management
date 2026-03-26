import express from "express";
import { LoginUser } from "../Controllers/UserLoginController.js";
import { authenticateToken, authorizeRoles } from "../Middleware/AuthMiddleware.js";

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
import ApprovealRouter from "./ApproveRoute.js";
import EmergencypassRoute from "./EmergencyRoute.js";
import GenralpassRoute from "./GenralPassRoute.js";
import AdminDashboardRouter from "./AdminDashboardRoute.js";
import PassReturnRouter from "./PassReturnRoute.js";

import { CreateNewUser, verifyOTP } from "../Controllers/UserRegisterController.js";

const Routes = express.Router();

// 🌍 Public Routes
Routes.post("/login", LoginUser);
Routes.post("/register", CreateNewUser);
Routes.post("/verify-otp", verifyOTP);

// 🛡️ ROLE-BASED PORTALS
// Student Portal — /student/student/profile, /student/add/student
Routes.use("/student", authenticateToken, authorizeRoles("STUDENT", "ADMIN"), StudentRouter);

// Caretaker Portal — /caretaker/dashboard/stats, /caretaker/mark-entry, etc.
Routes.use("/caretaker", authenticateToken, authorizeRoles("CARETAKER", "ADMIN", "STUDENT"), CaretakerRouter);
Routes.use("/caretaker", authenticateToken, authorizeRoles("CARETAKER", "ADMIN", "STUDENT"), ApprovealRouter);

// 🔒 SHARED ADMINISTRATIVE & METADATA RESOURCES
// Sub-path prefixes MUST match exactly what the frontend calls
const SharedRoles = ["ADMIN", "CARETAKER", "STUDENT", "ADVISOR"];

// Metadata dropdowns — used by all dashboards for forms/filters
Routes.use("/Admin/rooms",                authenticateToken, authorizeRoles(...SharedRoles), RoomRouter);
Routes.use("/Admin/departments",          authenticateToken, authorizeRoles(...SharedRoles), DepartmentRouter);
Routes.use("/Admin/advisors",             authenticateToken, authorizeRoles(...SharedRoles), AdvisorRouter);
Routes.use("/Admin/caretakers",           authenticateToken, authorizeRoles(...SharedRoles), CaretakerRouter);
Routes.use("/Admin/placements",           authenticateToken, authorizeRoles(...SharedRoles), BatchRouter);
Routes.use("/Admin/attendance",           authenticateToken, authorizeRoles(...SharedRoles), AttendanceRouter);
Routes.use("/Admin/placement-attendance", authenticateToken, authorizeRoles(...SharedRoles), PlacementAttendanceRouter);

// Pass management — use nested prefixes like /Admin/passes/general/g/entry/details
Routes.use("/Admin/passes/out",           authenticateToken, authorizeRoles(...SharedRoles), OutPassRouter);
Routes.use("/Admin/passes/general",       authenticateToken, authorizeRoles(...SharedRoles), GenralpassRoute);
Routes.use("/Admin/passes/emergency",     authenticateToken, authorizeRoles(...SharedRoles), EmergencypassRoute);
Routes.use("/Admin/passes/return",        authenticateToken, authorizeRoles(...SharedRoles), PassReturnRouter);
Routes.use("/Admin/passes/approve",       authenticateToken, authorizeRoles(...SharedRoles), ApprovealRouter);

// User management & password change
Routes.use("/Admin/users",                authenticateToken, authorizeRoles(...SharedRoles), Userrouter);

// Admin-only
Routes.use("/Admin/students",             authenticateToken, authorizeRoles("ADMIN"), StudentRouter);
Routes.use("/Admin",                      authenticateToken, authorizeRoles("ADMIN"), AdminDashboardRouter);

export default Routes;
