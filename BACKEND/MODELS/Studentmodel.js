import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  Name: {
    type: String,
    require: true,
  },
  Gender: {
    type: String,
    require: true,
  },
  StartYear: {
    type: Number,
    require: true,
    min: 2000,
    max: new Date().getFullYear() + 5,
  },
  Section: {
    type: String,
    require: true,
  },
  RollNumber: {
    type: String,
    require: true,
  },
  RegisterNumber: {
    type: String,
    require: true,
  },
  Status: {
    type: String,
    enum: ["ACTIVE", "GRADUATED", "DROPPED", "SUSPENDED", "PENDING"],
    default: "ACTIVE",
    required: true,
  },

  ParentMobileNumber: {
    type: String,
    require: true,
  },
  UserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  DepartmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  PlacementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Placement",
    required: true,
  },
  RoomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  AdvisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Advisor",
    required: true,
  },
});

const Student = new mongoose.model("Student", StudentSchema, "Student");

export default Student;
