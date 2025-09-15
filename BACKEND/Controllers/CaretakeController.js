import Caretaker from "../MODELS/Caretakermodel.js";
import User from "../MODELS/UserModel.js";

export const CreateNewCaretaker = async (req, res) => {
  try {
    const { Name, Email, Password, MobileNumber, Status, HostelBlock } =
      req.body;

    if (Password != "CARETAKER") {
      return res.status(400).json({ message: "ENTER CORRECT PASSWORD.." });
    }

    if (!Name || !Email || !MobileNumber || !Status || !HostelBlock) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ Email, Password });

    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "User Not found this email and password !" });
    }

    const CaretakerExist = await Caretaker.findOne({
      UserID: existingUser._id,
    });

    if (CaretakerExist) {
      return res
        .status(201)
        .json({ message: "This caretaker already exists !" });
    }

    const NewCaretaker = await new Caretaker({
      Name,
      Status,
      HostelBlock,
      UserID: existingUser._id,
    });

    await NewCaretaker.save();

    res
      .status(201)
      .json({
        message: Name + " caretaker Created Successfully",
        data: NewCaretaker,
      });
  } catch (err) {
    return res.status(401).json({ error: true, message: err.message });
  }
};

export const GetCaretakers = async (req, res) => {
  try {
    const caretaker = await Caretaker.find().populate("UserID");

    if (!caretaker) {
      return res.send("NO caretakerDATA IS THERE");
    }
    console.log();

    return res.status(201).json({
      message: "all caretaker details",
      data1: caretaker,
    });
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

    const caretaker = await Caretaker.findOne({ _id: ID }).populate("UserID");

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
    const { _id, Name, Email, Password, MobileNumber, Status, HostelBlock } =
      req.body;

    if (Password != "CARETAKER") {
      return res.status(400).json({ message: "ENTER CORRECT PASSWORD.." });
    }

    if (!Name || !Email || !MobileNumber || !Status || !HostelBlock) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const data = await Caretaker.findOneAndUpdate(
      { _id },
      { Name, Email, Password, MobileNumber, Status, HostelBlock },
      { new: true }
    ).populate("UserID");

    if (!data) {
      res.send("NO caretakerDATA IS THERE");
    }

    return res.status(201).json({ message: "update Successfully", data: data });
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

    const caretaker = await Caretaker.findOneAndDelete({ _id: id }).populate(
      "UserID"
    );

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
