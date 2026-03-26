import express from "express";
import { EntryAttendance ,GetAttendanceDetails,UpdateAttendance, DeleteAttendance} from "../Controllers/Attendancecontroller.js";


const AttendanceRouter = express.Router();

AttendanceRouter.post("/entry/add", EntryAttendance);
AttendanceRouter.get("/entry/details",GetAttendanceDetails);
AttendanceRouter.patch("/entry/update",UpdateAttendance);
AttendanceRouter.delete("/entry/delete",DeleteAttendance);


export default AttendanceRouter;