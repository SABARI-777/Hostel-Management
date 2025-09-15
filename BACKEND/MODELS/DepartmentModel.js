import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
  
  DepartmentName: {
    type: String,
    require: true,
    enum: ["CSE,ECE,IT,MECH,EEE,AIDS"],
  },
  HodNAME: {
    type: String,
    require: true,
  },
});

const Department = new mongoose.model(
  "Department",
  DepartmentSchema,
  "Department"
);

export default Department;
