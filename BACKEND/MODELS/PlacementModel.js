import mongoose from "mongoose";

const PlacementSchema = new mongoose.Schema({
  BatchName: {
    type: String,
    require: true,
  },
  Days: {
    type: [String],
    require: true,
    enum: ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"],
  },
  ClassTiming: {
    Start: {
      type: String,
      required: true,
    },
    End: {
      type: String,
      required: true,
    },
  },
  Status: {
    type: String,
    enum: ["UPCOMING", "ONGOING", "COMPLETED"],
    default: "UPCOMING",
  },
});

const Placement = mongoose.models.Placement || mongoose.model("Placement", PlacementSchema, "Placement");

export default Placement;
