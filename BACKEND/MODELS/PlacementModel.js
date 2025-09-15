import mongoose from "mongoose";

const PlacementSchema = new mongoose.Schema({
  BatchName: {
    type: String,
    require: true,
    enum: ["AZ","BC","SDE0","SDE1","AIML"],
  },
  Days: {
    type: [String],
    require: true,
    enum: ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"],
  },
  ClassTiming: {
    Start: {
      type: Date,
      required: true,
    },
    End: {
      type: Date,
      required: true,
    },
  },
  Status: {
    type: String,
    enum: ["UPCOMING", "ONGOING", "COMPLETED"],
    default: "UPCOMING",
  },
});

const Placement = new mongoose.model("Placement", PlacementSchema, "Placement");

export default Placement;
