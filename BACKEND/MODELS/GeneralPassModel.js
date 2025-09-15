import mongoose from "mongoose";

const GeneralPassSchema = new mongoose.Schema(
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

const GeneralPass = mongoose.model(
  "GeneralPass",
  GeneralPassSchema,
  "GeneralPass"
);

export default GeneralPass;
