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
      default: Date.now,
    },
    Document: {
      type: String,
      require: true,
    },
    Year:{
      type:Number,
      require:true,
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
    approved: {
      type: String,
      default: "NO",
    },
    EntryType: {
      type: String,
      require: true,
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
      default: "Genralpass",
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
