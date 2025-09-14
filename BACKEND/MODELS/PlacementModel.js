import mongoose from "mongoose";

const PlacementSchema = new mongoose.Schema({
  Batch_name:{
    type: String,
    require: true,
    enum:["AZ,BC,SDE0,SDE1,AIML"]
  },
Batch_type:{
    type:Number,
    require:true,
    enum:[1,2,3,4,5,6]
  }
});

const Placement = new mongoose.model("Placement", PlacementSchema, "Placement");

export default Placement;
