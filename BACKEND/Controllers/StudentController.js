import Student from "../MODELS/Studentmodel.js";
import User from "../MODELS/UserModel.js";
import Advisor from "../MODELS/AdvisorModel.js";
import Room from "../MODELS/RoomModel.js";
import DepartmentModel from "../MODELS/DepartmentModel.js";
import PlacementModel from "../MODELS/PlacementModel.js";

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
      DepartmentName,
      BatchName,
      RoomNumber,
      AdvisorName,
    } = req.body;

    // Validate required fields
    if (!Name) return res.status(400).json({ message: "Name is required." });
    if (!Email) return res.status(400).json({ message: "Email is required." });
    if (!RollNumber) return res.status(400).json({ message: "Roll Number is required." });
    if (!RegisterNumber) return res.status(400).json({ message: "Register Number is required." });
    if (!ParentMobileNumber) return res.status(400).json({ message: "Parent Mobile Number is required." });
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
    const department = await DepartmentModel.findOne({ DepartmentName });
    if (!department) {
      return res.status(400).json({ message: "Department not found." });
    }

    // Find batch
    const batch = await PlacementModel.findOne({ BatchName });
    if (!batch) {
      return res.status(400).json({ message: "Batch not found." });
    }

    // Find advisor
    const advisor = await Advisor.findOne({ Name: AdvisorName });
    if (!advisor) {
      return res.status(400).json({ message: "Advisor not found." });
    }

    // Find room
    const room = await Room.findOne({ RoomNumber });
    if (!room) {
      return res.status(400).json({ message: "Room not found." });
    }

    const newStudent = new Student({
      Name,
      Gender,
      StartYear,
      Section,
      RollNumber,
      RegisterNumber,
      Status,
      ParentMobileNumber,
      UserId: existingUser._id,
      DepartmentId: department._id,
      PlacementId: batch._id,
      RoomId: room._id,
      AdvisorId: advisor._id,
    });

    await newStudent.save();

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
    } = req.body;

    if (!_id) return res.status(400).json({ message: "Student ID is required." });

    if (
      !Name ||
      !Gender ||
      !StartYear ||
      !Section ||
      !RollNumber ||
      !RegisterNumber ||
      !Status ||
      !ParentMobileNumber
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      _id,
      {
        Name,
        Gender,
        StartYear,
        Section,
        RollNumber,
        RegisterNumber,
        Status,
        ParentMobileNumber,
      },
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
    const { _id } = req.body;

    if (!_id) return res.status(400).json({ message: "Student ID is required." });

    const deletedStudent = await Student.findByIdAndDelete(_id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found." });
    }

    return res.status(200).json({
      message: "Student deleted successfully.",
      data: deletedStudent,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};
