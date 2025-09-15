import mongoose from "mongoose";

import User from "../MODELS/UserModel.js";

export const CreateNewUser = async (req, res) => {
  try {
    const { Email, Password, MobileNumber, Type } = req.body;

    if (!Email) {
      return res.status(400).json({ message: "Enter email ....." });
    }

    if (!Password) {
      return res.status(400).json({ message: "Enter password.." });
    }
    if (!MobileNumber) {
      return res.status(400).json({ message: "Enter MobileNumber.." });
    }
    if (!Type) {
      return res.status(400).json({ message: "Enter Type.." });
    }

    if (Type == "CARETAKER" || Type == "ADVISOR" || Type == "ADMIN") {
      if (Type == "CARETAKER" && Password != "CARETAKER") {
        return res
          .status(401)
          .json({ message: "Enter valid CARETAKER password" });
      } else if (Type == "ADVISOR" && Password != "ADVISOR") {
        return res.status(401).json({ message: "Enter valid password" });
      } else if (Type == "ADMIN" && Password != "ADMIN") {
        return res.status(401).json({ message: "Enter valid password" });
      }
    }

    const NewUser = await new User({ Email, Password, MobileNumber, Type });

    await NewUser.save();

    res
      .status(201)
      .json({ message: "User Created Successfully", data: NewUser });
  } catch (err) {
    return res.status(400).json({ error: true, message: err.message });
  }
};

export const GetUsers = async (req, res) => {
  try {
    const user = await User.find();

    if (!user) {
      return res.send("NO USERDATA IS THERE");
    }

    return res.status(201).json({ message: "all user details", data: user });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};

export const GetUserByID = async (req, res) => {
  try {
    const _id = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Enter ID" });
    }

    const user = await User.findOne(_id);

    if (!user) {
      res.send("NO USERDATA IS THERE");
    }

    return res.status(201).json({ message: "user details", data: user });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};

export const UpdateUser = async (req, res) => {
  try {
    const { _id, Email, Password, MobileNumber, Type } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Enter ID" });
    }
    if (!Email) {
      return res.status(400).json({ message: "Enter email ....." });
    }

    if (!Password) {
      return res.status(400).json({ message: "Enter password.." });
    }
    if (!MobileNumber) {
      return res.status(400).json({ message: "Enter MobileNumber.." });
    }
    if (!Type) {
      return res.status(400).json({ message: "Enter Type.." });
    }

    if (Type == "CARETAKER" || Type == "ADVISOR" || Type == "ADMIN") {
      if (Type == "CARETAKER" && Password != "CARETAKER") {
        return res
          .status(401)
          .json({ message: "Enter valid CARETAKER password" });
      } else if (Type == "ADVISOR" && Password != "ADVISOR") {
        return res.status(401).json({ message: "Enter valid password" });
      } else if (Type == "ADMIN" && Password != "ADMIN") {
        return res.status(401).json({ message: "Enter valid password" });
      }
    }

    const user = await User.findOneAndUpdate(
      { _id },
      { Email, Password, MobileNumber, Type },
      { new: true }
    );

    if (!user) {
      res.send("NO USERDATA IS THERE");
    }

    const NewUser = await User({ Email, Password, MobileNumber, Type });

    return res
      .status(201)
      .json({ message: "update user  Successfully", data: NewUser });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};

export const DeleteUser = async (req, res) => {
  try {
    const { _id, Password } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Enter ID" });
    }

    if (!Password) {
      return res.status(400).json({ message: "Enter password" });
    }

    const user = await User.findOne({ _id });

    if (!user) {
      res.send("NO USERDATA IS THERE");
    }

    if (user.Password != Password) {
      return res.status(401).json({ message: "user password incorrect !" });
    }
    const users = await User.findOneAndDelete({ _id });

    return res
      .status(201)
      .json({ message: " user Deleted successfully", data: users });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};
