import express from "express";

import {
  AddRooms,
  GetRoomdetails,
  UpdateRoom,
  DeleteRoom,
} from "../Controllers/RoomController.js";

const RoomRouter = express.Router();

RoomRouter.post("/room/add", AddRooms);
RoomRouter.get("/room/details", GetRoomdetails);
RoomRouter.patch("/room/update",UpdateRoom);
RoomRouter.delete("/room/delete", DeleteRoom);

export default RoomRouter;
