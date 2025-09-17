import PlacementAttendanceDetails from "../MODELS/PlacementAttendenceModel.js";
import Student from "../MODELS/Studentmodel.js";

// ---------------- CREATE ----------------
export const PlacementEntryAttendance = async (req, res) => {
  try {
    const { OutDateTime, Name, Status, EntryType } = req.body;

    if (!Name) return res.status(400).json({ message: "Student name is required." });
    if (!EntryType) return res.status(400).json({ message: "EntryType is required." });
    if (!Status) return res.status(400).json({ message: "Status is required." });

    const existingStudent = await Student.findOne({ Name });
    if (!existingStudent) return res.status(404).json({ message: "Student not found!" });

    // 🚨 Check if student is in placement
    if (!existingStudent.PlacementId) {
      return res.status(403).json({ message: "This student is not enrolled in any placement, attendance not allowed." });
    }

    const entry = new PlacementAttendanceDetails({
      InDateTime: new Date(),
      OutDateTime, // optional at entry
      StudentId: existingStudent._id,
      Status,
      RoomId: existingStudent.RoomId,
      PlacementId: existingStudent.PlacementId,
      EntryType,
    });

    await entry.save();

    return res.status(201).json({
      message: "Placement attendance entry recorded successfully",
      data: entry,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while recording placement attendance",
      error: error.message,
    });
  }
};


// ---------------- GET ALL OR BY STUDENT ----------------
export const GetPlacementAttendance = async (req, res) => {
  try {
    const { Name } = req.body; //if provided, filter by student name

    let query = {};

    if (Name) {
      const student = await Student.findOne({ Name });
      if (!student) {
        return res.status(404).json({ message: "Student not found!" });
      }

      // 🚨 Ensure student is in placement
      if (!student.PlacementId) {
        return res.status(403).json({
          message: "This student is not enrolled in any placement, attendance not allowed.",
        });
      }

      query.StudentId = student._id;
    }

    const details = await PlacementAttendanceDetails.find(query)
      .populate("StudentId")
      .populate("RoomId")
      .populate("PlacementId");

    if (!details || details.length === 0) {
      return res.status(404).json({ message: "No placement attendance records found." });
    }

    return res.status(200).json({
      message: "Placement attendance records fetched successfully",
      data: details,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while fetching placement attendance records",
      error: error.message,
    });
  }
};

// ---------------- UPDATE ----------------
export const UpdatePlacementAttendance = async (req, res) => {
  try {
    const { _id, OutDateTime, Name, Status, EntryType } = req.body;

    if (!_id) return res.status(400).json({ message: "Attendance _id is required." });
    if (!Name) return res.status(400).json({ message: "Student name is required." });
    if (!EntryType) return res.status(400).json({ message: "EntryType is required." });

    const existingStudent = await Student.findOne({ Name });
    if (!existingStudent) return res.status(404).json({ message: "Student not found!" });

    // 🚨 Check if student is in placement
    if (!existingStudent.PlacementId) {
      return res.status(403).json({ message: "This student is not enrolled in any placement, attendance update not allowed." });
    }

    const updatedAttendance = await PlacementAttendanceDetails.findOneAndUpdate(
      { _id },
      {
        OutDateTime,
        InDateTime: new Date(),
        StudentId: existingStudent._id,
        Status,
        RoomId: existingStudent.RoomId,
        PlacementId: existingStudent.PlacementId,
        EntryType,
      },
      { new: true }
    )
      .populate("StudentId")
      .populate("RoomId")
      .populate("PlacementId");

    if (!updatedAttendance) {
      return res.status(404).json({ message: "Placement attendance record not found." });
    }

    return res.status(200).json({
      message: "Placement attendance updated successfully",
      data: updatedAttendance,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while updating placement attendance",
      error: error.message,
    });
  }
};
