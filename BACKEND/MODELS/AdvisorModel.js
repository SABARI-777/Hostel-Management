import mongoose from "mongoose";

const AdvisorSchema = new mongoose.Schema({
  Name: {
    type: String,
    require: true,
  },
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Designation: {
    type: String,
    enum: ["Assistant Professor", "Associate Professor", "Professor", "HOD"],
    default: "Assistant Professor",
  },
  DepartmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
});

const Advisor = new mongoose.model("Advisor", AdvisorSchema, "Advisor");

export default Advisor;
