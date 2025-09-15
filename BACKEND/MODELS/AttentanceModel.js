import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    InDateTime: {
      type: Date,
      required: false,
      default: Date.now,
    },
    OutDateTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    StudentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    Status: {
      type: String,
      enum: ["IN", "OUT"],
      default: "OUT",
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

const AttendanceDetails = mongoose.model(
  "AttendanceDetails",
  AttendanceSchema,
  "AttendanceDetails"
);

export default "AttendanceDetails";
