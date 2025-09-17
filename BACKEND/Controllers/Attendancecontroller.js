import AttendanceDetails from "../MODELS/AttentanceModel.js";
import Student from "../MODELS/Studentmodel.js";

// ---------------- CREATE ----------------
export const EntryAttendance = async (req, res) => {
  try {
    const { Name, Status, EntryType } = req.body;

    if (!Name) {
      return res.status(400).json({ message: "Student name is required." });
    }
    if (!EntryType) {
      return res.status(400).json({ message: "EntryType is required." });
    }

    const existingStudent = await Student.findOne({ Name });
    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found!" });
    }

    const entry = new AttendanceDetails({
      InDateTime: new Date(),
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

// ---------------- READ ----------------
export const GetAttendanceDetails = async (req, res) => {
  try {
    const details = await AttendanceDetails.find()
      .populate("StudentId")
      .populate("RoomId");

    if (!details || details.length === 0) {
      return res.status(404).json({ message: "No attendance records found." });
    }

    return res.status(200).json({
      message: "All attendance records fetched successfully",
      data: details,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while fetching attendance records",
      error: error.message,
    });
  }
};

// ---------------- UPDATE ----------------
export const UpdateAttendance = async (req, res) => {
  try {
    const { _id, Name, Status, EntryType } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Attendance _id is required." });
    }
    if (!Name) {
      return res.status(400).json({ message: "Student name is required." });
    }
    if (!EntryType) {
      return res.status(400).json({ message: "EntryType is required." });
    }

    const existingStudent = await Student.findOne({ Name });
    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found!" });
    }

    const updatedAttendance = await AttendanceDetails.findOneAndUpdate(
      { _id },
      {
        InDateTime: new Date(),
        StudentId: existingStudent._id,
        Status,
        RoomId: existingStudent.RoomId,
        EntryType,
      },
      { new: true }
    )
      .populate("StudentId")
      .populate("RoomId");

    if (!updatedAttendance) {
      return res.status(404).json({ message: "Attendance record not found." });
    }

    return res.status(200).json({
      message: "Attendance updated successfully",
      data: updatedAttendance,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while updating attendance",
      error: error.message,
    });
  }
};
