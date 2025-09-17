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
    Approved: {
      type: String,
      default: "NO",
    },
    EntryType: {
      type: String,
      required: true,
      enum: ["MANUAL", "BIOMETRIC"], // fixed spelling
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
      default: "GeneralPass", // fixed typo
    },
  },
  {
    timestamps: true,
  }
);

const GeneralPass = mongoose.model("GeneralPass", GeneralPassSchema);

export default GeneralPass;
