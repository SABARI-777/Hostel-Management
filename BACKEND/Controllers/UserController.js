import mongoose from "mongoose";
import User from "../MODELS/UserModel.js";

export const CreateNewUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Enter email ....." });
    }

    if (!password) {
      return res.status(400).json({ message: "Enter password.." });
    }


    const NewUser = await new User({ email, password });

    await NewUser.save();

    res
      .status(201)
      .json({ message: "User Created Successfully", data: NewUser });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};

export const GetUsers = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Enter Username ....." });
    }

    if (!password) {
      return res.status(400).json({ message: "Enter password.." });
    }

    if (username != "ADMIN" || password != "ADMIN") {
      return res.status(400).json({ message: "AUTHENTICATION FAILED...." });
    }

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

    return res
      .status(201)
      .json({ message: "get user successfully", data: user });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};

export const UpdateUser = async (req, res) => {
  try {
    const { _id, email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Enter email ....." });
    }

    if (!password) {
      return res.status(400).json({ message: "Enter password.." });
    }

    if (!_id) {
      return res.status(400).json({ message: "Enter ID" });
    }

    const user = await User.findOneAndUpdate(
      { _id },
      { email, password },
      { new: true }
    );

    if (!user) {
      res.send("NO USERDATA IS THERE");
    }

    const NewUser = await User({ email, password });

    return res.status(201).json({ message: "get Successfully", data: NewUser });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};

export const DeleteUser = async (req, res) => {
  try {
    const id = req.body;

    if (!id) {
      return res.status(400).json({ message: "Enter ID" });
    }

    const user = await User.findOneAndDelete({ _id: id });

    if (!user) {
      res.send("NO USERDATA IS THERE");
    }

    return res
      .status(201)
      .json({ message: " user Deleted successfully", data: user });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};
