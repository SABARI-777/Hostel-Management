import mongoose from "mongoose";
import department from "./DepartmentModel";

const AdvisorSchema = new mongoose.Schema({
  Advisor_name: {
    type: String,
    require: true,
  },
  Advisor_mobile_number:{
    type:Number,
    require:true
  },
  department:{
    type:String,
    require:true
  },
   type: {
    type: String,
    default: "ADVISOR",
  }
});

const Advisor = new mongoose.model("Advisor", AdvisorSchema, "Advisor");

export default Advisor;
