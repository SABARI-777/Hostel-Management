import mongoose from "mongoose";
const AdvisorSchema = new mongoose.Schema({
  Name: {
    type: String,
    require: true,
  },
  Designation: {
    type: String,
    enum: ["Assistant Professor", "Associate Professor", "Professor", "HOD"],
    default: "Assistant Professor",
  },
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  DepartmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
});

const Advisor = new mongoose.model("Advisor", AdvisorSchema, "Advisor");

export default Advisor;
