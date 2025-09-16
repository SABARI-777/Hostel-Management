import mongoose from "mongoose";

const PlacementSchema = new mongoose.Schema({
  BatchName: {
    type: String,
    require: true,
    enum: ["AZ","BC","SDE0","SDE1","AIML","SDE2","MERN","DB"],
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

const Placement = new mongoose.model("Placement", PlacementSchema, "Placement");

export default Placement;

