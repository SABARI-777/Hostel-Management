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
});

const department = new mongoose.model("Department", DepartmentSchema, "Department");

export default department;
