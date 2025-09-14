
// Pass_Entry
// PE_ID PK
// E_id FK
// GP_ID FK

import mongoose from "mongoose";

const PassEntrySchema = new mongoose.Schema({
   PassDetailsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PassDetails',
      required: true,
    },
    OutPassId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OutPass',
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

const PassEntry = new mongoose.model("PassEnrty", PassEntrySchema, "PassEntry");

export default PassEntry;
