import User from "../MODELS/UserModel.js";
import Student from "../MODELS/Studentmodel.js";
import Caretaker from "../MODELS/Caretakermodel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const JWT_SECRET = (process.env.JWT_SECRET || "fallback_secret").trim();

export const LoginUser = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email) {
      return res.status(400).json({ message: "Enter email ....." });
    }

    if (!Password) {
      return res.status(400).json({ message: "Enter password.." });
    }

    const user = await User.findOne({ Email });

    if (!user || !(await user.comparePassword(Password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
        { id: user._id, email: user.Email, role: user.Type },
        JWT_SECRET,
        { expiresIn: "1d" }
    );

    // Fetch role-specific details to enhance session data
    let roleData = {};
    if (user.Type === "CARETAKER") {
      const ct = await Caretaker.findOne({ UserID: user._id });
      if (ct) {
        roleData.HostelBlock = ct.HostelBlock;
        roleData.CaretakerId = ct._id;
      }
    } else if (user.Type === "STUDENT") {
      const stu = await Student.findOne({ UserId: user._id }).populate("RoomId");
      if (stu) {
        roleData.HostelBlock = stu.RoomId?.HostelBlock;
        roleData.StudentId = stu._id;
        roleData.Gender = stu.Gender;
      }
    }

    return res
      .status(200)
      .json({ 
          success: true,
          message: `${user.Type} login successful`, 
          token: token,
          data: {
              _id: user._id,
              Name: user.Name,
              Email: user.Email,
              Type: user.Type,
              ...roleData
          }
      });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};

export const ChangePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // From authenticateToken middleware

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Old and New passwords are required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Verify old password
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect old password." });
    }

    // Update password (pre-save hook will hash it)
    user.Password = newPassword;
    await user.save();

    return res.status(200).json({ success: true, message: "Password updated successfully!" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
 
