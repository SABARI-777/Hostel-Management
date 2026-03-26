import Caretaker from "../Models/Caretakermodel.js";
import User from "../Models/UserModel.js";
import Student from "../Models/Studentmodel.js";

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

    const caretaker = await Caretaker.findOne({ UserID: _id }).populate("UserID");
    if (!caretaker) {
      return res.status(404).json({ success: false, message: "Caretaker Profile not found for this user." });
    }

    return res.status(200).json({
      success: true,
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

    const caretaker = await Caretaker.findById(_id);
    if (!caretaker) return res.status(404).json({ message: "Caretaker not found." });

    // Precise Check: Are there students in rooms belonging to this block?
    // 1. Get all Room IDs for this HostelBlock
    const Room = (await import("../Models/RoomModel.js")).default;
    const roomsInBlock = await Room.find({ HostelBlock: caretaker.HostelBlock }).select("_id");
    const roomIds = roomsInBlock.map(r => r._id);

    // 2. See if any student is assigned to these rooms
    const activeStudentInBlock = await Student.findOne({ 
        RoomId: { $in: roomIds },
        Status: "ACTIVE" 
    });

    if (activeStudentInBlock) {
         // Check if this is the ONLY active caretaker for this block
         const otherCaretakers = await Caretaker.countDocuments({ 
             HostelBlock: caretaker.HostelBlock, 
             _id: { $ne: _id },
             Status: "ACTIVE"
         });
         
         if (otherCaretakers === 0) {
             return res.status(400).json({ 
                 message: `Cannot delete the last active Caretaker for Block ${caretaker.HostelBlock} while active students are residing there. Please assign a new Caretaker to this block first.` 
             });
         }
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
// ---------------- UPDATE PROFILE ----------------
export const UpdateCaretakerProfile = async (req, res) => {
  try {
    const { _id, Name, Email, Password } = req.body;

    if (!_id) return res.status(400).json({ message: "ID is required." });

    const caretaker = await Caretaker.findOne({ UserID: _id }).populate("UserID");
    if (!caretaker) return res.status(404).json({ message: "Caretaker Profile not found for this user." });

    if (Name) caretaker.Name = Name;
    await caretaker.save();

    if (Email || Password) {
      const user = await User.findById(caretaker.UserID._id);
      if (user) {
        if (Email) user.Email = Email;
        if (Password) user.Password = Password; // In real app, hash it, but here we follow existing pattern
        await user.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: caretaker,
    });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};
