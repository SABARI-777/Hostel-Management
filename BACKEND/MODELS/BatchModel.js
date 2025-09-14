import mongoose from "mongoose";

const PlacementBatchSchema = new mongoose.Schema({
  Days:{
    type:[String],
    require: true,
    enum:["MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY"]
  },
  Timing:{
    Type:[String],
    require:true,
    enum:["08-10 PM","09-10 PM","10-11 PM","06-08 PM"]
  },
  NightClass:{
    Type:Boolean,
    require:true,
    enum:[true,false]
  }
});

const PlacementBatch = new mongoose.model("PlacementBatch", PlacementBatchSchema, "PlacementBatch");

export default PlacementBatch;
