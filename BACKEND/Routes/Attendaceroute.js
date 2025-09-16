import express from "express";
import { EntryAttendance ,GetAttendacedetails,UpdateAttendance} from "../Controllers/Attendancecontroller.js";


const AttendanceRouter = express.Router();

AttendanceRouter.post("/entry/add", EntryAttendance);
AttendanceRouter.get("/entry/details",GetAttendacedetails);
AttendanceRouter.patch("/entry/update",UpdateAttendance);


export default AttendanceRouter;