import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  RoomNumber: {
    type: Number,
    require: true,
  },
  HostelBlock: {
    type: String,
    require: true,
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

const Room = mongoose.models.Room || mongoose.model("Room", RoomSchema, "Room");

export default Room;
