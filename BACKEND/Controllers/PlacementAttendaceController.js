import PlacementAttendanceDetails from "../MODELS/PlacementAttendenceModel.js";
import Student from "../MODELS/Studentmodel.js";

export const PlacementEntryAttendance = async (req, res) => {
  try {
    const { OutDateTime, Name, Status, EntryType } = req.body;

    if (!Name) {
      return res.status(400).json({ message: "Enter student name" });
    }

    if (!EntryType) {
      return res.status(400).json({ message: "Enter EntryType" });
    }

    if (!OutDateTime) {
      return res.status(400).json({ message: "Enter Outdatetime name" });
    }

    if (!Status) {
      return res.status(400).json({ message: "Enter STATUS" });
    }

    const existingStudent = await Student.findOne({ Name });

    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found!" });
    }

    const InDateTime = new Date();

    const entry = new PlacementAttendanceDetails({
      OutDateTime,
      InDateTime,
      StudentId: existingStudent._id,
      Status,
      RoomId: existingStudent.RoomId,
      PlacementId: existingStudent.PlacementId,
      EntryType,
    });

    await entry.save();

    return res.status(201).json({
      message: "placement Attendance entry recorded successfully",
      data: entry,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while recording attendance",
      error: error.message,
    });
  }
};

export const GetPlacementAttendacedetails = async (req, res) => {
  try {
    const details = await PlacementAttendanceDetails.find()
      .populate("StudentId")
      .populate("RoomId")
      .populate("PlacementId");

    if (!details) {
      return res.status(500).json({ message: "NO ATTENDACE RECORDS YET !" });
    }

    return res
      .status(200)
      .json({ message: "All ATTENDACE RECORDS !", data: details });
  } catch (error) {
    return res.status(200).json({
      message: " error on get ATTENDACE RECORDS !",
      error: error.message,
    });
  }
};

export const UpdatePlacementAttendance = async (req, res) => {
  try {
    const { _id, OutDateTime, Name, Status, EntryType } = req.body;

    if (!Name) {
      return res.status(400).json({ message: "Enter student name" });
    }

    if (!EntryType) {
      return res.status(400).json({ message: "Enter EntryType" });
    }

    const existingStudent = await Student.findOne({ Name });

    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found!" });
    }

    const InDateTime = new Date();

    const updatedPlacementAttendaceDetails =
      await PlacementAttendanceDetails.findOneAndUpdate(
        { _id },
        {
          OutDateTime,
          InDateTime,
          StudentId: existingStudent._id,
          Status,
          RoomId: existingStudent.RoomId,
          EntryType,
        },
        { new: true }
      )
        .populate("StudentId")
        .populate("RoomId")
        .populate("PlacementId");

    await updatedPlacementAttendaceDetails.save();

    console.log(updatedPlacementAttendaceDetails);

    return res.status(201).json({
      message: "Attendance UPDATED recorded successfully",
      data: updatedPlacementAttendaceDetails,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while recording UPDATE ATTENDACE",
      error: error.message,
    });
  }
};
