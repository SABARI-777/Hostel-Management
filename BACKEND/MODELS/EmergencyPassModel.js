import mongoose from "mongoose";

const EmergencyPassSchema = new mongoose.Schema(
  {
    outDateTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    document:{
        type:String,
        require:true,
    },
    inDateTime: {
      type: Date,
      required: false,
      default: Date.now,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    caretakerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Caretaker",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Emergencypass = mongoose.model("Emergencypass", EmergencyPassSchema,"Emergencypass");

export default Emergencypass;

// EMERGENCY 