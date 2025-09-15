import mongoose from "mongoose";

const EmergencyPassSchema = new mongoose.Schema(
  {
    OutDateTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    Document: {
      type: String,
      require: true,
    },
    InDateTime: {
      type: Date,
      required: false,
      default: Date.now,
    },
    StudentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    CaretakerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Caretaker",
      required: true,
    },
    Place: {
      type: String,
      require: true,
    },
    Purpose: {
      type: String,
      require: true,
    },
    Status: {
      type: String,
      enum: ["OUT", "IN"],
      default: "OUT",
    },
    Approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const EmergencyPass = mongoose.model(
  "EmergencyPass",
  EmergencyPassSchema,
  "EmergencyPass"
);

export default EmergencyPass;
