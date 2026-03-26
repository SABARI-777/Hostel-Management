import mongoose from "mongoose";

const EmergencyPassSchema = new mongoose.Schema(
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
    ExpectedInDateTime: {
      type: Date,
      required: false,
    },
    ActualInDateTime: {
      type: Date,
      required: false,
    },
    LateEntry: {
      type: Boolean,
      default: false,
    },
    PassId: {
      type: String,
      required: true,
      unique: true,
    },
    Document: {
      type: String,
      required: true,
    },
    Year:{
      type: String,
      required: true,
    },
    Place: {
      type: String,
      required: true,
    },
    Purpose: {
      type: String,
      required: true,
    },
    Status: {
      type: String,
      enum: ["OUT", "IN"],
      default: "OUT",
    },
    approved: {
      type: String,
      default: "NO",
    },
    EntryType: {
      type: String,
      required: true,
      enum: ["MANUAL", "BIOMATRIC"],
    },
    StudentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    CaretakerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Caretaker",
      required: true,
    },
    Type: {
      type: String,
      default: "EmergencyPass",
    },
  },
  {
    timestamps: true,
  }
);

const EmergencyPass = mongoose.models.EmergencyPass || mongoose.model("EmergencyPass", EmergencyPassSchema, "EmergencyPass");

export default EmergencyPass;
