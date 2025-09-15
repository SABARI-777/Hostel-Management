import mongoose from "mongoose";
import User from "../MODELS/UserModel.js";

export const LoginUser = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email) {
      return res.status(400).json({ message: "Enter email ....." });
    }

    if (!Password) {
      return res.status(400).json({ message: "Enter password.." });
    }

    const user = await User.findOne({ Email, Password });

    if (!user) {
      return res.send("NO USERDATA IS THERE");
    }

    return res
      .status(201)
      .json({ message: user.Type + " Login successfully", data: user });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};
 
