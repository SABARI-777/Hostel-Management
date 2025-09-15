import mongoose from "mongoose";

const CaretakerSchema = new mongoose.Schema({
  Name: {
    type: String,
    require: true,
  },
  Status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE",
  },
  HostelBlock: {
    type: String,
    require: true,
    enum: ["A", "B", "C", "D"],
  },
  UserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Caretaker = new mongoose.model("Caretaker", CaretakerSchema, "Caretaker");

export default Caretaker;
