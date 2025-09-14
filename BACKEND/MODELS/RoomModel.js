import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  roomnumber: {
    type: Number,
    require: true,
  },
  Hostelblock:{
     type: String,
     require:true
   },
   studentId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Student",
         required: true,
       }
});

const Room = new mongoose.model("Room", RoomSchema, "Room");

export default Room;
