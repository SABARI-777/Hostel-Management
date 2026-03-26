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
    required: true,
  },
  RollNumber: {
    type: String,
    required: true,
  },
  RegisterNumber: {
    type: String,
    required: true,
  },
  Status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE", "GRADUATED", "DROPPED", "SUSPENDED", "PENDING"],
    default: "ACTIVE",
    required: true,
  },

  ParentMobileNumber: {
    type: String,
    require: true,
  },
  ParentEmail: {
    type: String,
    required: true,
  },
  UserId: {
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
  LateEntryCount: {
    type: Number,
    default: 0,
  },
});

const Student = mongoose.models.Student || mongoose.model("Student", StudentSchema, "Student");

export default Student;
