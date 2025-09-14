import mongoose from "mongoose";

const PassSchema = new mongoose.Schema({
  place: {
    type: String,
    require: true,
  },
  purpose: {
    type: String,
    require: true,
  },
   OutpassId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Outpass',
      required: true,
    },
    HomepassId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Homepass',
      required: true,
    },
     EmergencypassId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Emergencypass',
      required: true,
    },
});

const PassDetails = new mongoose.model("Pass", PassSchema, "Pass");

export default PassDetails;
