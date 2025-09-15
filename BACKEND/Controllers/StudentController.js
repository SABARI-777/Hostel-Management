import mongoose from "mongoose";
import Student from "../MODELS/Studentmodel.js";
import Caretaker from "../MODELS/Caretakermodel.js";

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
      MobileNumber,
      ParentMobileNumber,
      DepartmentName,
      BatchName,
      
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Enter name.." });
    }

    if (!email) {
      return res.status(400).json({ message: "Enter email ....." });
    }

    if (!roll_number) {
      return res.status(400).json({ message: "Enter rollnumber" });
    }

    if (!register_number) {
      return res.status(400).json({ message: "Enter register_number" });
    }

    if (!mobile_number) {
      return res.status(400).json({ message: "Enter mobile number" });
    }

    if (!parent_mobile) {
      return res.status(400).json({ message: "Enter parent  mobile" });
    }

    const NewStudent = await new Student({
      name,
      email,
      roll_number,
      register_number,
      mobile_number,
      parent_mobile,
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
    const { Username, password } = req.body;

    if (!Username) {
      return res.status(400).json({ message: "Enter Username ....." });
    }

    if (!password) {
      return res.status(400).json({ message: "Enter password.." });
    }

    const caretaker = await Caretaker.findOne({ Username, password });

    if (!caretaker) {
      return res
        .status(401)
        .json({ message: "authention failed on caretaker !" });
    }

    const students = await Student.find();

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

export const GetStudentByID = async (req, res) => {
  try {
    const _id = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Enter ID" });
    }

    const stundet = await Student.findOne(_id);

    if (!stundet) {
      res.send("NO STUDNET detail enter correct id:");
    }

    return res.status(201).json({ message: "STUDENT DETAIL", data: stundet });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};

export const UpdateStudent = async (req, res) => {
  try {
    const { _id,name, email, roll_number,register_number,mobile_number,parent_mobile } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Enter email ....." });
    }

    if (!name) {
      return res.status(400).json({ message: "Enter name.." });
    }

    if(!roll_number){
      return res.status(400).json({ message: "Enter rollnumber.." });
    }

    if(!register_number){
      return res.status(400).json({ message: "Enter reg_number.." });
    }

    if(!mobile_number){
      res.status(400).json({ message: "Enter mobilenumber.." });
    }

    if(!parent_mobile){
      res.status(400).json({ message: "Enter parent mobile number.." });
    }

    const student = await Student.findOneAndUpdate(
      { _id },
      { name,email,roll_number,register_number,mobile_number,parent_mobile},
      { new: true }
    );

    if (!student) {
      res.send("NO studentDATA IS THERE");
    }

    const studentdetials = await Student({name,email,roll_number,register_number,mobile_number,parent_mobile});
    
    await studentdetials.save(); 
    
    return res
      .status(201)
      .json({ message: "update Successfully", data: studentdetials });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};

export const DeleteStudent = async (req, res) => {
  try {
    const id = req.body;

    if (!id) {
      return res.status(400).json({ message: "Enter ID" });
    }

    const student = await Student.findOneAndDelete({ _id: id });

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
