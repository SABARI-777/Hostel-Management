import mongoose from "mongoose";

const AdvisorSchema = new mongoose.Schema({
  Advisor_name: {
    type: String,
    require: true,
  },
    password:{
     type: String,
    default: "ADVISOR",
  },
  Advisor_mobile_number:{
    type:Number,
    require:true
  },
   type: {
    type: String,
    default: "ADVISOR",
  }
});

const Advisor = new mongoose.model("Advisor", AdvisorSchema, "Advisor");

export default Advisor;
