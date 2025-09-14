import mongoose from "mongoose";

const CaretakerSchema = new mongoose.Schema({
  Username: {
    type: String,
    require: true,
  },
  password:{
     type: String,
    default: "CARETAKER",
  },
  mobile_number: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    default: "CARETAKER",
  },
   studentId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Student",
         required: true,
       },
});

const Caretaker = new mongoose.model("Caretaker", CaretakerSchema, "Caretaker");

export default Caretaker;
