import AttendanceDetails from "../Models/AttentanceModel.js";
import Student from "../Models/Studentmodel.js";
import OutPass from "../Models/OutpassModel.js";
import GeneralPass from "../Models/GeneralPassModel.js";
import EmergencyPass from "../Models/EmergencyPassModel.js";
import Caretaker from "../Models/Caretakermodel.js";
import Room from "../Models/RoomModel.js";

// ---------------- CREATE ----------------
export const EntryAttendance = async (req, res) => {
  try {
    
    const { Name, Status, EntryType, caretakerId } = req.body;

    if (!Name) {
      return res.status(400).json({ message: "Student name is required." });
    }
    if (!EntryType) {
      return res.status(400).json({ message: "EntryType is required." });
    }

    const existingStudent = await Student.findOne({ Name: Name.trim() }).populate("RoomId");
    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found!" });
    }

    // 🛡️ Block Isolation for Caretakers
    if (caretakerId) {
      const ct = await Caretaker.findById(caretakerId);
      if (ct && existingStudent.RoomId && existingStudent.RoomId.HostelBlock !== ct.HostelBlock) {
        return res.status(403).json({ 
          message: `Block mismatch! Student ${Name} is in Block ${existingStudent.RoomId.HostelBlock}, but you can only manage Block ${ct.HostelBlock}.` 
        });
      }
    }

    const now = new Date();
    let finalStatus = Status || "PRESENT";

    // 🚨 Check if student is "OUT" on a pass
    const [outPass, genPass, emPass] = await Promise.all([
      OutPass.findOne({ StudentId: existingStudent._id, Status: "OUT" }),
      GeneralPass.findOne({ StudentId: existingStudent._id, Status: "OUT" }),
      EmergencyPass.findOne({ StudentId: existingStudent._id, Status: "OUT" })
    ]);

    if (outPass || genPass || emPass) {
      finalStatus = "LEAVE (PASS)";
    }

    const entry = new AttendanceDetails({
      InDateTime: now,
      StudentId: existingStudent._id,
      Status: finalStatus,
      RoomId: existingStudent.RoomId?._id || existingStudent.RoomId,
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
      .populate({ path: "StudentId", populate: { path: "DepartmentId" } })
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
    const { _id, Name, Status, EntryType, caretakerId } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Attendance _id is required." });
    }
    if (!Name) {
      return res.status(400).json({ message: "Student name is required." });
    }
    if (!EntryType) {
      return res.status(400).json({ message: "EntryType is required." });
    }

    const existingStudent = await Student.findOne({ Name: Name.trim() }).populate("RoomId");
    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found!" });
    }

    // 🛡️ Block Isolation for Caretakers
    if (caretakerId) {
      const ct = await Caretaker.findById(caretakerId);
      if (ct && existingStudent.RoomId && existingStudent.RoomId.HostelBlock !== ct.HostelBlock) {
        return res.status(403).json({ 
          message: `Block mismatch! Student ${Name} is in Block ${existingStudent.RoomId.HostelBlock}, but you can only manage Block ${ct.HostelBlock}.` 
        });
      }
    }

    const updatedAttendance = await AttendanceDetails.findOneAndUpdate(
      { _id },
      {
        InDateTime: new Date(),
        StudentId: existingStudent._id,
        Status,
        RoomId: existingStudent.RoomId?._id || existingStudent.RoomId,
        EntryType,
      },
      { new: true }
    )
      .populate({ path: "StudentId", populate: { path: "DepartmentId" } })
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

// ---------------- DELETE ----------------
export const DeleteAttendance = async (req, res) => {
  try {
    const { _id, caretakerId } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Attendance _id is required." });
    }

    // 🛡️ Block Isolation for Caretakers
    if (caretakerId) {
      const ct = await Caretaker.findById(caretakerId);
      const record = await AttendanceDetails.findById(_id).populate("RoomId");
      if (ct && record && record.RoomId && record.RoomId.HostelBlock !== ct.HostelBlock) {
        return res.status(403).json({ 
          message: `Block mismatch! You cannot delete attendance records for Block ${record.RoomId.HostelBlock}.` 
        });
      }
    }

    const deletedAttendance = await AttendanceDetails.findByIdAndDelete(_id);

    if (!deletedAttendance) {
      return res.status(404).json({ message: "Attendance record not found." });
    }

    return res.status(200).json({
      message: "Attendance deleted successfully",
      data: deletedAttendance,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while deleting attendance",
      error: error.message,
    });
  }
};
