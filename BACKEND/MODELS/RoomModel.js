import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  RoomNumber: {
    type: Number,
    require: true,
  },
  HostelBlock: {
    type: String,
    require: true,
    enum: ["A", "B", "C", "D"],
  },
  Capacity: {
    type: Number,
    required: true,
    default: 1,
    min: 4,
    max: 6,
  },
  Occupancy: {
    type: Number,
    min:0,
    require: true,
  },
});

const Room = new mongoose.model("Room", RoomSchema, "Room");

export default Room;
