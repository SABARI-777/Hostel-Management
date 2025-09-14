// E_id PK
// PASS_Late Entry
// Attendence_Late_Entry 

import mongoose from "mongoose";

const EntryDetailsSchema = new mongoose.Schema({
 PassLateEntry: {
    type: Number,
    require:false,
  },
  AttentenceLateEntry: {
    type: Number,
    require:false,
  },
   studentId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Student",
         required: true,
       }
});

const EntryDetails = new mongoose.model("EntryDetails", EntryDetailsSchema, "EntryDetails");

export default EntryDetails;
