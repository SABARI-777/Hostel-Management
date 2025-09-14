import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
  Department_name: {
    type: String,
    require: true,
    enum:["CSE,ECE,IT,MECH,EEE,AIDS"]
  },
  HOD_NAME: {
    type: String,
    require: true,
  },
  studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
      },
  AdvisorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Advisor",
        required: true,
      },
});

const department = new mongoose.model("Department", DepartmentSchema, "Department");

export default department;
