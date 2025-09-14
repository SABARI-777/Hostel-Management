import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  startyear:
  { 
    type:Number,
    require:true,
    enum:[2020,2021,2022,2023,2024,2025,2026,2027]
  },
  roll_number: {
    type: String,
    require: true,
  },
  register_number: {
    type: String,
    require: true,
  },
  mobile_number: {
    type: String,
    require: true,
  },
  parent_mobile: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    default: "STUDENT",
  },
});

const Student = new mongoose.model("Student", StudentSchema, "Student");

export default Student;
