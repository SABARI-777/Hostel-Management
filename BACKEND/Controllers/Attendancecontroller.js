import AttendanceDetails from "../MODELS/AttentanceModel.js";
import Student from "../MODELS/Studentmodel.js";

export const EntryAttendance = async (req, res) => {
  try {
    const { Name, Status, EntryType } = req.body;

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

    const entry = new AttendanceDetails({
      InDateTime,
      StudentId: existingStudent._id,
      Status,
      RoomId: existingStudent.RoomId,
      EntryType,
    });

    await entry.save();

    return res.status(201).json({
      message: "Attendance entry recorded successfully",
      data: entry,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while recording attendance",
      error: error.message,
    });
  }
};

export const GetAttendacedetails = async (req, res) => {
  try {
    const details = await AttendanceDetails.find()
      .populate("StudentId")
      .populate("RoomId");

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

export const UpdateAttendance = async (req, res) => {
  try {
    const { _ID, Name, Status, EntryType } = req.body;

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

    const updatedAttendaceDetails = await AttendanceDetails.findOneAndUpdate(
      { _ID },
      {
        InDateTime,
        InDateTime,
        StudentId: existingStudent._id,
        Status,
        RoomId: existingStudent.RoomId,
        EntryType,
      }
    );

    await updatedAttendaceDetails.save();

    return res.status(201).json({
      message: "Attendance UPDATED recorded successfully",
      data: updatedAttendaceDetails,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while recording UPDATE ATTENDACE",
      error: error.message,
    });
  }
};
