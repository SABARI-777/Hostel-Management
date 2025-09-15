import mongoose from "mongoose";

const OutPassSchema = new mongoose.Schema(
  {
    OutDateTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    InDateTime: {
      type: Date,
      default: null,
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
    Place: {
      type: String,
      required: true,
      trim: true,
    },
    Purpose: {
      type: String,
      required: true,
      trim: true,
    },
    Status: {
      type: String,
      enum: ["OUT", "IN"],
      default: "OUT",
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const OutPass = mongoose.model("OutPass", OutPassSchema, "OutPass");

export default OutPass;
