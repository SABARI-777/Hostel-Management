import mongoose from "mongoose";
import User from "../MODELS/UserModel.js";


export const LoginUser = async (req, res) => {
  try {
    const {email,password} = req.body;
   
     if (!email) {
      return res.status(400).json({ message: "Enter email ....." });
    }

    if (!password) {
      return res.status(400).json({ message: "Enter password.." });
    }

    const user = await User.findOne({email,password});

    if (!user) {
      return res.send("NO USERDATA IS THERE");
    }

    return res.status(201).json({ message: "User Login successfully", data: user });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};

