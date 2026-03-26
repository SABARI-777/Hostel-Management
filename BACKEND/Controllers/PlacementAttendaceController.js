import PlacementAttendanceDetails from "../Models/PlacementAttendenceModel.js";
import Student from "../Models/Studentmodel.js";
import Room from "../Models/RoomModel.js";
import Placement from "../Models/PlacementModel.js";
import OutPass from "../Models/OutpassModel.js";
import GeneralPass from "../Models/GeneralPassModel.js";
import EmergencyPass from "../Models/EmergencyPassModel.js";
import Caretaker from "../Models/Caretakermodel.js";

// ---------------- CREATE ----------------
export const PlacementEntryAttendance = async (req, res) => {
  try {
    const { OutDateTime, Name, Status, EntryType, caretakerId } = req.body;

    if (!Name) return res.status(400).json({ message: "Student name is required." });
    if (!EntryType) return res.status(400).json({ message: "EntryType is required." });
    if (!Status) return res.status(400).json({ message: "Status is required." });

    const existingStudent = await Student.findOne({ Name: Name.trim() }).populate("RoomId");
    if (!existingStudent) return res.status(404).json({ message: "Student not found!" });

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
    let finalStatus = Status || "IN";

    // 🚨 Check if student is "OUT" on a pass
    const [outPass, genPass, emPass] = await Promise.all([
      OutPass.findOne({ StudentId: existingStudent._id, Status: "OUT" }),
      GeneralPass.findOne({ StudentId: existingStudent._id, Status: "OUT" }),
      EmergencyPass.findOne({ StudentId: existingStudent._id, Status: "OUT" })
    ]);

    if (outPass || genPass || emPass) {
      finalStatus = "LEAVE (PASS)";
    }

    // 🚨 Check if student is in placement
    if (!existingStudent.PlacementId) {
      return res.status(403).json({ message: "This student is not enrolled in any placement, attendance not allowed." });
    }

    const entry = new PlacementAttendanceDetails({
      InDateTime: now,
      OutDateTime, // optional at entry
      StudentId: existingStudent._id,
      Status: finalStatus,
      RoomId: existingStudent.RoomId?._id || existingStudent.RoomId,
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
    const Name = req.query?.Name || (req.body && req.body.Name); // Safely get Name if provided

    let query = {};

    if (Name) {
      const student = await Student.findOne({ Name: Name.trim() });
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
      .populate({ path: "StudentId", populate: { path: "DepartmentId" } })
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
    const { _id, OutDateTime, Name, Status, EntryType, caretakerId } = req.body;

    if (!_id) return res.status(400).json({ message: "Attendance _id is required." });
    if (!Name) return res.status(400).json({ message: "Student name is required." });
    if (!EntryType) return res.status(400).json({ message: "EntryType is required." });

    const existingStudent = await Student.findOne({ Name: Name.trim() }).populate("RoomId");
    if (!existingStudent) return res.status(404).json({ message: "Student not found!" });

    // 🛡️ Block Isolation for Caretakers
    if (caretakerId) {
      const ct = await Caretaker.findById(caretakerId);
      if (ct && existingStudent.RoomId && existingStudent.RoomId.HostelBlock !== ct.HostelBlock) {
        return res.status(403).json({ 
          message: `Block mismatch! Student ${Name} is in Block ${existingStudent.RoomId.HostelBlock}, but you can only manage Block ${ct.HostelBlock}.` 
        });
      }
    }

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
        RoomId: existingStudent.RoomId?._id || existingStudent.RoomId,
        PlacementId: existingStudent.PlacementId,
        EntryType,
      },
      { new: true }
    )
      .populate({ path: "StudentId", populate: { path: "DepartmentId" } })
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

// ---------------- DELETE ----------------
export const DeletePlacementAttendance = async (req, res) => {
  try {
    const { _id, caretakerId } = req.body;

    if (!_id) return res.status(400).json({ message: "Attendance _id is required." });

    // 🛡️ Block Isolation for Caretakers
    if (caretakerId) {
      const ct = await Caretaker.findById(caretakerId);
      const record = await PlacementAttendanceDetails.findById(_id).populate("RoomId");
      if (ct && record && record.RoomId && record.RoomId.HostelBlock !== ct.HostelBlock) {
        return res.status(403).json({ 
          message: `Block mismatch! You cannot delete placement records for Block ${record.RoomId.HostelBlock}.` 
        });
      }
    }

    const deletedAttendance = await PlacementAttendanceDetails.findByIdAndDelete(_id);

    if (!deletedAttendance) {
      return res.status(404).json({ message: "Placement attendance record not found." });
    }

    return res.status(200).json({
      message: "Placement attendance deleted successfully",
      data: deletedAttendance,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while deleting placement attendance",
      error: error.message,
    });
  }
};
