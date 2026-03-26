import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
  DepartmentName: {
    type: String,
    required: true,
  },
  HodName: {
    type: String,
    required: true,
  },
});

const DepartmentModel = mongoose.models.Department || mongoose.model("Department", DepartmentSchema, "Department");

export default DepartmentModel;
