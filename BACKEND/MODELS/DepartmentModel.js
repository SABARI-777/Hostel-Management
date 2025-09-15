import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
  DepartmentName: {
    type: String,
    require: true,
    enum: ["CSE", "ECE", "IT", "MECH", "EEE", "AIDS"],
  },
  HodName: {
    type: String,
    require: true,
  },
});

const DepartmentModel = new mongoose.model(
  "Department",
  DepartmentSchema,
  "Department"
);

export default DepartmentModel;
