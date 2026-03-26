import Student from "../MODELS/Studentmodel.js";
import User from "../MODELS/UserModel.js";
import Advisor from "../MODELS/AdvisorModel.js";
import Room from "../MODELS/RoomModel.js";
import DepartmentModel from "../MODELS/DepartmentModel.js";
import PlacementModel from "../MODELS/PlacementModel.js";
import Caretaker from "../MODELS/Caretakermodel.js";
import sendTestEmail from '../connecter/send.js'
// ================== CREATE STUDENT ==================
export const CreateNewStudent = async (req, res) => {
  try {
    const {
      Name,
      Gender,
      StartYear,
      Email,
      Section,
      RollNumber,
      RegisterNumber,
      Status,
      ParentMobileNumber,
      ParentEmail,
      DepartmentName,
      BatchName,
      RoomNumber,
      CaretakerName,
      AdvisorName,
      ExpectedInDateTime, // Not used here but might be in body
      caretakerId 
    } = req.body;

    // 🛡️ Block Isolation for Caretakers
    if (caretakerId) {
      const ct = await Caretaker.findById(caretakerId);
      const targetRoom = await Room.findOne({ RoomNumber: Number(RoomNumber) });
      if (ct && targetRoom && targetRoom.HostelBlock !== ct.HostelBlock) {
        return res.status(403).json({ 
          message: `Block mismatch! You are assigned to Block ${ct.HostelBlock}, but trying to add a student to Room ${RoomNumber} in Block ${targetRoom.HostelBlock}.` 
        });
      }
    }

    // Validate required fields
    if (!Name) return res.status(400).json({ message: "Name is required." });
    if (!Email) return res.status(400).json({ message: "Email is required." });
    if (!RollNumber) return res.status(400).json({ message: "Roll Number is required." });
    if (!RegisterNumber) return res.status(400).json({ message: "Register Number is required." });
    if (!ParentMobileNumber) return res.status(400).json({ message: "Parent Mobile Number is required." });
    if (!ParentEmail) return res.status(400).json({ message: "Parent Email is required." });
    if (!Gender) return res.status(400).json({ message: "Gender is required." });
    if (!StartYear) return res.status(400).json({ message: "Start Year is required." });
    if (!Section) return res.status(400).json({ message: "Section is required." });
    if (!Status) return res.status(400).json({ message: "Status is required." });

    // Check if linked user exists
    const existingUser = await User.findOne({ Email });
    if (!existingUser) {
      return res.status(400).json({ message: "No user found with this email." });
    }

    // Check if student already exists
    const studentExist = await Student.findOne({ UserId: existingUser._id });
    if (studentExist) {
      return res.status(409).json({ message: "Student already registered." });
    }

    // Find department
    const department = await DepartmentModel.findOne({ DepartmentName: DepartmentName.trim() });
    if (!department) {
      return res.status(400).json({ message: "Department not found." });
    }

    // Find batch
    const batch = await PlacementModel.findOne({ BatchName: BatchName.trim() });
    if (!batch) {
      return res.status(400).json({ message: "Batch not found." });
    }

    // Find advisor
    const advisor = await Advisor.findOne({ Name: AdvisorName.trim() });
    if (!advisor) {
      return res.status(400).json({ message: "Advisor not found." });
    }

    // Find room
    const room = await Room.findOne({ RoomNumber: Number(RoomNumber) });
    if (!room) {
      return res.status(400).json({ message: "Room not found." });
    }

    if (room.Occupancy >= room.Capacity) {
      return res.status(400).json({ message: "Room is fully filled." });
    }

    const newStudent = new Student({
      Name,
      Gender,
      StartYear,
      Section: Section ? Section.toUpperCase() : "A",
      RollNumber,
      RegisterNumber,
      Status: Status ? Status.toUpperCase() : "ACTIVE",
      ParentMobileNumber,
      ParentEmail,
      UserId: existingUser._id,
      DepartmentId: department._id,
      PlacementId: batch._id,
      RoomId: room._id,
      AdvisorId: advisor._id,
    });

    await newStudent.save();

    room.Occupancy += 1;
    await room.save();

    res.status(201).json({
      message: "Student created successfully.",
      data: newStudent,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

// ================== GET ALL STUDENTS ==================
export const GetStudent = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("UserId")
      .populate("RoomId")
      .populate("DepartmentId")
      .populate("AdvisorId")
      .populate("PlacementId");

    if (!students || students.length === 0) {
      return res.status(404).json({ message: "No student details found." });
    }

    return res.status(200).json({
      message: "All student details fetched successfully.",
      data: students,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

// ================== GET STUDENT BY USER ID (FOR PROFILE) ==================
export const GetStudentByUserID = async (req, res) => {
  try {
    const userId = req.user?.id; // From authenticateToken middleware
    if (!userId) return res.status(401).json({ message: "Unauthorized access." });

    const student = await Student.findOne({ UserId: userId })
      .populate("UserId")
      .populate("RoomId")
      .populate("DepartmentId")
      .populate("AdvisorId")
      .populate("PlacementId");

    if (!student) {
      return res.status(404).json({ success: false, message: "Student profile not found for this user." });
    }

    return res.status(200).json({
      success: true,
      message: "Student profile fetched successfully.",
      data: student,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

// ================== UPDATE STUDENT ==================
export const UpdateStudent = async (req, res) => {
  try {
    const {
      _id,
      Name,
      Gender,
      StartYear,
      Section,
      RollNumber,
      RegisterNumber,
      Status,
      ParentMobileNumber,
      ParentEmail,
      AdvisorName,
      caretakerId
    } = req.body;

    if (!_id) return res.status(400).json({ message: "Student ID is required." });

    // 🛡️ Block Isolation for Caretakers
    if (caretakerId) {
      const ct = await Caretaker.findById(caretakerId);
      const student = await Student.findById(_id).populate("RoomId");
      if (ct && student && student.RoomId && student.RoomId.HostelBlock !== ct.HostelBlock) {
        return res.status(403).json({ 
          message: `Block mismatch! You cannot manage students from Block ${student.RoomId.HostelBlock}.` 
        });
      }
    }

    if (
      !Name ||
      !Gender ||
      !StartYear ||
      !Section ||
      !RollNumber ||
      !RegisterNumber ||
      !Status ||
      !ParentMobileNumber ||
      !ParentEmail
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find and validate advisor if provided
    let advisorId = undefined;
    if (AdvisorName) {
      const advisor = await Advisor.findOne({ Name: AdvisorName.trim() });
      if (!advisor) {
        return res.status(400).json({ message: `Advisor '${AdvisorName}' not found.` });
      }
      advisorId = advisor._id;
    }

    const updatePayload = {
      Name,
      Gender,
      StartYear,
      Section: Section ? Section.toUpperCase() : "A",
      RollNumber,
      RegisterNumber,
      Status: Status ? Status.toUpperCase() : "ACTIVE",
      ParentMobileNumber,
      ParentEmail,
    };

    if (advisorId) {
      updatePayload.AdvisorId = advisorId;
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      _id,
      updatePayload,
      { new: true }
    )
      .populate("UserId")
      .populate("RoomId")
      .populate("DepartmentId")
      .populate("AdvisorId")
      .populate("PlacementId");

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found." });
    }

    return res.status(200).json({
      message: "Student updated successfully.",
      data: updatedStudent,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

// ================== DELETE STUDENT ==================
export const DeleteStudent = async (req, res) => {
  try {
    const { _id, caretakerId } = req.body;

    if (!_id) return res.status(400).json({ message: "Student ID is required." });

    // 🛡️ Block Isolation for Caretakers
    if (caretakerId) {
      const ct = await Caretaker.findById(caretakerId);
      const student = await Student.findById(_id).populate("RoomId");
      if (ct && student && student.RoomId && student.RoomId.HostelBlock !== ct.HostelBlock) {
        return res.status(403).json({ 
          message: `Block mismatch! You cannot delete students from Block ${student.RoomId.HostelBlock}.` 
        });
      }
    }

    const deletedStudent = await Student.findByIdAndDelete(_id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found." });
    }

    const room = await Room.findById(deletedStudent.RoomId);
    if (room && room.Occupancy > 0) {
      room.Occupancy -= 1;
      await room.save();
    }

    return res.status(200).json({
      message: "Student deleted successfully.",
      data: deletedStudent,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};
