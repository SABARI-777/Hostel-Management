import mongoose from "mongoose";

const PlacementAttendancePassSchema = new mongoose.Schema(
  {
    OutDateTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    InDateTime: {
      type: Date,
      required: false,
      default: null,
    },
    Status: {
      type: String,
      enum: ["OUT","IN"],
      default: "OUT",
    },
    StudentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    RoomId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Room",
          required: true,
        },
    PlacementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Placement",
      require:true,
    },
     EntryType: {
      type: String,
      enum: ["BIOMETRIC", "MANUAL"],
      default: "BIOMETRIC",
    },

  },
  {
    timestamps: true,
  }
);

const PlacementAttendanceDetails = mongoose.model(
  "PlacementAttendanceDetails",
  PlacementAttendancePassSchema,
  "PlacementAttendanceDetails"
);

export default PlacementAttendanceDetails;
