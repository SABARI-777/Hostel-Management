import Caretaker from "../MODELS/Caretakermodel.js";
import User from "../MODELS/UserModel.js";

// ---------------- CREATE ----------------
export const CreateNewCaretaker = async (req, res) => {
  try {
    const { Name, Email, Status, HostelBlock } = req.body;

    if (!Name || !Email || !Status || !HostelBlock) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find existing user
    const existingUser = await User.findOne({ Email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "User not found with this email." });
    }

    // Check if caretaker already exists
    const caretakerExists = await Caretaker.findOne({
      UserID: existingUser._id,
    });
    if (caretakerExists) {
      return res.status(400).json({ message: "Caretaker already exists." });
    }

    const newCaretaker = new Caretaker({
      Name,
      Status,
      HostelBlock,
      UserID: existingUser._id,
    });

    await newCaretaker.save();

    return res.status(201).json({
      message: "Caretaker created successfully",
      data: newCaretaker,
    });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};

// ---------------- READ ----------------
export const GetCaretakers = async (req, res) => {
  try {
    const caretakers = await Caretaker.find().populate("UserID");

    if (!caretakers || caretakers.length === 0) {
      return res.status(404).json({ message: "No caretakers found." });
    }

    return res.status(200).json({
      message: "All caretaker details",
      data: caretakers,
    });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};

export const GetCaretakerByID = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Caretaker ID is required." });
    }

    const caretaker = await Caretaker.findById(_id).populate("UserID");

    if (!caretaker) {
      return res.status(404).json({ message: "Caretaker not found." });
    }

    return res.status(200).json({
      message: "Caretaker details fetched successfully",
      data: caretaker,
    });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};

// ---------------- UPDATE ----------------
export const UpdateCaretaker = async (req, res) => {
  try {
    const { _id, Name, Status, HostelBlock } = req.body;

    if (!_id || !Name || !Status || !HostelBlock) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const updatedCaretaker = await Caretaker.findByIdAndUpdate(
      _id,
      { Name, Status, HostelBlock },
      { new: true }
    ).populate("UserID");

    if (!updatedCaretaker) {
      return res.status(404).json({ message: "Caretaker not found." });
    }

    return res.status(200).json({
      message: "Caretaker updated successfully",
      data: updatedCaretaker,
    });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};

// ---------------- DELETE ----------------
export const DeleteCaretaker = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Caretaker ID is required." });
    }

    const deletedCaretaker = await Caretaker.findByIdAndDelete(_id).populate(
      "UserID"
    );

    if (!deletedCaretaker) {
      return res.status(404).json({ message: "Caretaker not found." });
    }

    return res.status(200).json({
      message: "Caretaker deleted successfully",
      data: deletedCaretaker,
    });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};
