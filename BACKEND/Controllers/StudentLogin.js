import mongoose from "mongoose";
import Student from "../MODELS/Studentmodel.js";

export const LoginStundet = async (req, res) => {
  try {
    const {roll_number} = req.body;
    
     if (!roll_number) {
      return res.status(400).json({ message: "Enter roll_number ....." });
    }

    // if (!password) {
    //   return res.status(400).json({ message: "Enter password.." });
    // }

    const student = await Student.findOne({roll_number});

    if (!student) {
      return res.send("NO studentDATA IS THERE");
    }
    
    if(!student.type=="STUDENT")
    {
       return res.status(201).json({ message: "authentication failed", data: student });
    }

    return res.status(201).json({ message: "student Login successfully", data: student });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};

