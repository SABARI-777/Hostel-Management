import mongoose from "mongoose";
import Caretaker from "../MODELS/Caretakermodel.js";

export const CreateNewCaretaker = async (req, res) => {
  try {
    const { Username, password, mobile_number } = req.body;

    if (password != "CARETAKER") {
      return res.status(400).json({ message: "ENTER CORRECT PASSWORD.." });
    }

    if (!Username) {
      return res.status(400).json({ message: "Enter Username ....." });
    }

    if (!mobile_number) {
      return res.status(400).json({ message: "Enter mobile_number.." });
    }

    const NewCaretaker = await new Caretaker({ Username, mobile_number });

    await NewCaretaker.save();

    res
      .status(201)
      .json({ message: "caretaker Created Successfully", data: NewCaretaker });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};

export const GetCaretaker = async (req, res) => {
  try {
    const caretaker = await Caretaker.find();

    if (!caretaker) {
      return res.send("NO caretakerDATA IS THERE");
    }

    return res
      .status(201)
      .json({ message: "all caretaker details", data: caretaker });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};

export const GetCaretakerByID = async (req, res) => {
  try {
    const ID = req.body;

    if (!ID) {
      return res.status(400).json({ message: "Enter ID" });
    }

    const caretaker = await Caretaker.findOne(ID);

    if (!caretaker) {
      res.send("NO caretaker IS THERE");
    }

    return res
      .status(201)
      .json({ message: "get user successfully", data: caretaker });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};

export const UpdateCaretaker = async (req, res) => {
  try {
    const { _id, name, mobile_number } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Enter email ....." });
    }

    if (!mobile_number) {
      return res.status(400).json({ message: "Enter password.." });
    }

    if (!_id) {
      return res.status(400).json({ message: "Enter ID" });
    }

    const data = await Caretaker.findOneAndUpdate(
      { _id },
      { name, mobile_number },
      { new: true }
    );

    if (!data) {
      res.send("NO caretakerDATA IS THERE");
    }

    const caretaker = await Caretaker({ name, mobile_number });

    return res
      .status(201)
      .json({ message: "get Successfully", data: caretaker });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};

export const DeleteCaretaker = async (req, res) => {
  try {
    const id = req.body;

    if (!id) {
      return res.status(400).json({ message: "Enter ID" });
    }

    const caretaker = await Caretaker.findOneAndDelete({ _id: id });

    if (!caretaker) {
      res.send("NO caretakerDATA IS THERE");
    }

    return res
      .status(201)
      .json({ message: " user Deleted successfully", data: caretaker });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};
