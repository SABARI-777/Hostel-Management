import express from "express";
import { EntryAttendance ,GetAttendanceDetails,UpdateAttendance} from "../Controllers/Attendancecontroller.js";


const AttendanceRouter = express.Router();

AttendanceRouter.post("/entry/add", EntryAttendance);
AttendanceRouter.get("/entry/details",GetAttendanceDetails);
AttendanceRouter.patch("/entry/update",UpdateAttendance);


export default AttendanceRouter;