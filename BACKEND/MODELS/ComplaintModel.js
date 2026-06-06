import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema({
  StudentUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  RollOrRegNo: {
    type: String,
    required: true,
  },
  RoomNo: {
    type: String,
    required: true,
  },
  Year: {
    type: String,
    required: true,
  },
  Department: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  ComplaintDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  Time: {
    type: String,
    required: true,
  },
  Status: {
    type: String,
    enum: ["PENDING", "RESOLVED"],
    default: "PENDING",
    required: true,
  },
}, { timestamps: true });

const Complaint = mongoose.models.Complaint || mongoose.model("Complaint", ComplaintSchema, "Complaint");

export default Complaint;
