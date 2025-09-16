import mongoose from "mongoose";
import Student from "../MODELS/Studentmodel.js";
import User from "../MODELS/UserModel.js";
import Advisor from "../MODELS/AdvisorModel.js";
import Room from "../MODELS/RoomModel.js";
import DepartmentModel from "../MODELS/DepartmentModel.js";
import PlacementModel from "../MODELS/PlacementModel.js";

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

    if (!Name) {
      return res.status(400).json({ message: "Enter name.." });
    }

    if (!Email) {
      return res.status(400).json({ message: "Enter email ....." });
    }

    if (!RollNumber) {
      return res.status(400).json({ message: "Enter rollnumber" });
    }

    if (!RegisterNumber) {
      return res.status(400).json({ message: "Enter register_number" });
    }

    if (!ParentMobileNumber) {
      return res.status(400).json({ message: "Enter parent  number" });
    }

    if (!Gender) {
      return res.status(400).json({ message: "Enter gender  mobile" });
    }

    if (!StartYear) {
      return res.status(400).json({ message: "Enter start year  mobile" });
    }

    if (!Section) {
      return res.status(400).json({ message: "Enter Section !" });
    }

    if (!Status) {
      return res.status(400).json({ message: "Enter Status !" });
    }

    const existingUser = await User.findOne({ Email });

    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "User Not found this email and password !" });
    }

    const Studentexist = await Student.findOne({
      UserId: existingUser._id,
    });

    // if (Studentexist) {
    //   return res.status(200).json({ message: "student already register !" });
    // }

    const department = await DepartmentModel.findOne({ DepartmentName });

    if (!department) {
      return res.status(400).json({ message: "department Not found !" });
    }

    const batch = await PlacementModel.findOne({ BatchName });

    if (!batch) {
      return res.status(400).json({ message: "batch Not found !" });
    }

    const advisor = await Advisor.findOne({ Name: AdvisorName });

    console.log(advisor);

    if (!advisor) {
      return res.status(400).json({ message: "advisor Not found !" });
    }
    
    const room = await Room.findOne({ RoomNumber });

    if(!room){
      return res.status(201).json({message:"no room details !"});
    }

    const NewStudent = await new Student({
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

    await NewStudent.save();

    res
      .status(201)
      .json({ message: "Student Created Successfully", data: NewStudent });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};

export const GetStudent = async (req, res) => {
  try {
    // const { Username, password } = req.body;

    // if (!Username) {
    //   return res.status(400).json({ message: "Enter Username ....." });
    // }

    // if (!password) {
    //   return res.status(400).json({ message: "Enter password.." });
    // }

    // const caretaker = await Caretaker.findOne({ Username, password });

    // if (!caretaker) {
    //   return res
    //     .status(401)
    //     .json({ message: "authention failed on caretaker !" });
    // }

    const students = await Student.find()
      .populate("UserId")
      .populate("RoomId")
      .populate("DepartmentId")
      .populate("AdvisorId")
      .populate("PlacementId");

    if (!students) {
      return res.send("NO stundent details IS THERE");
    }

    return res
      .status(201)
      .json({ message: "all student details", data: students });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};

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

    if (!_id) {
      return res.status(400).json({ message: "Student ID is required." });
    }

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

    const data = await Student.findOneAndUpdate(
      { _id },
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

    if (!data) {
      return res.send("NO student DATA IS THERE");
    }

    return res.status(201).json({ message: "Update Successfully", data: data });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};

export const DeleteStudent = async (req, res) => {
  try {
    const _id = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Enter ID" });
    }

    const student = await Student.findOneAndDelete({ _id });

    if (!student) {
      res.send("NO student IS THERE");
    }

    return res
      .status(201)
      .json({ message: " student Deleted successfully", data: student });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};
