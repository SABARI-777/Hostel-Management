import mongoose from "mongoose";
const AdvisorSchema = new mongoose.Schema({
  Name: {
    type: String,
    require: true,
  },
  Designation: {
    type: String,
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

const Advisor = mongoose.models.Advisor || mongoose.model("Advisor", AdvisorSchema, "Advisor");

export default Advisor;
