import mongoose from "mongoose";

const OutPassSchema = new mongoose.Schema(
  {
    outDateTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    inDateTime: {
      type: Date,
      required: false,
      default:Date.now,
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

const Outpass = mongoose.model("Outpass", OutPassSchema, "Outpass");

export default Outpass;
