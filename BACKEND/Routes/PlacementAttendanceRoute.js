import express from "express";
import {
  PlacementEntryAttendance,
  GetPlacementAttendance,
  UpdatePlacementAttendance,
  DeletePlacementAttendance
} from "../Controllers/PlacementAttendaceController.js";

const PlacementAttendanceRouter = express.Router();

PlacementAttendanceRouter.post("/p/entry/add", PlacementEntryAttendance);
PlacementAttendanceRouter.get("/p/entry/details", GetPlacementAttendance);
PlacementAttendanceRouter.patch("/p/entry/update", UpdatePlacementAttendance);
PlacementAttendanceRouter.delete("/p/entry/delete", DeletePlacementAttendance);

export default PlacementAttendanceRouter;
