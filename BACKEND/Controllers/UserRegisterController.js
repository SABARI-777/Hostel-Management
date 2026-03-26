import User from "../Models/UserModel.js";
import OTP from "../Models/OTPModel.js";
import { sendOTP } from "../utils/sendEmail.js";


// ================== CREATE USER ==================
export const CreateNewUser = async (req, res) => {
  try {
    const { Email, Password, MobileNumber, Type } = req.body;

    if (!Email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!Password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (!MobileNumber) {
      return res.status(400).json({ message: "MobileNumber is required" });
    }
    if (!Type) {
      return res.status(400).json({ message: "Type is required" });
    }

    // Strict Role-Based Password Security Check
    const rolePasswords = {
      "STUDENT": process.env.STUDENT_PASSWORD,
      "CARETAKER": process.env.CARETAKER_PASSWORD,
      "ADVISOR": process.env.ADVISOR_PASSWORD,
      "ADMIN": process.env.ADMIN_PASSWORD,
    };

    if (Password !== rolePasswords[Type]) {
      return res.status(401).json({ message: `Access Denied: Invalid password for ${Type} registration.` });
    }

    const existingUser = await User.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const newUser = new User({ Email, Password, MobileNumber, Type });
    await newUser.save();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const newOTP = new OTP({ Email, otp });
    await newOTP.save();

    await sendOTP(Email, otp);

    return res
      .status(201)
      .json({ message: "User created and OTP sent successfully", data: newUser, Email: newUser.Email });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};

// ================== GET ALL USERS ==================
export const GetUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No user data found" });
    }

    return res.status(200).json({ message: "All user details", data: users });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};

// ================== GET USER BY ID ==================
export const GetUserByID = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User details", data: user });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};

// ================== UPDATE USER ==================
export const UpdateUser = async (req, res) => {
  try {
    const { _id, Email, Password, MobileNumber, Type } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "ID is required" });
    }
    if (!Email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!Password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (!MobileNumber) {
      return res.status(400).json({ message: "MobileNumber is required" });
    }
    if (!Type) {
      return res.status(400).json({ message: "Type is required" });
    }

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.Email = Email;
    user.MobileNumber = MobileNumber;
    user.Type = Type;
    
    // Only update password if it's provided and not the placeholder
    if (Password && Password !== "Not Needed For Update") {
        user.Password = Password; // Will trigger pre-save hook
    }

    const updatedUser = await user.save();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User updated successfully", data: updatedUser });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};

// ================== DELETE USER ==================
export const DeleteUser = async (req, res) => {
  try {
    const { _id, Password } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "ID is required" });
    }
    if (!Password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!await user.comparePassword(Password)) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    await User.findByIdAndDelete(_id);

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};

// ================== VERIFY OTP ==================
export const verifyOTP = async (req, res) => {
  try {
    const { Email, otp } = req.body;

    if (!Email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const otpRecord = await OTP.findOne({ Email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await OTP.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({ message: "OTP Verified Successfully" });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};
