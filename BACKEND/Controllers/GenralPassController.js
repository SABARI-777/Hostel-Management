import GeneralPass from "../MODELS/GeneralPassModel.js";
import Student from "../MODELS/Studentmodel.js";
import Caretaker from "../MODELS/Caretakermodel.js";

export const createNewHomePass = async (req, res) => {
  try {
    const {
      Name,
      Year,
      Place,
      Purpose,
      Status,
      approved,
      OutDateTime,
      EntryType,
      CaretakerName,
    } = req.body;

    if (
      !Name ||
      !Year ||
      !Place ||
      !Purpose ||
      !OutDateTime ||
      !Status ||
      !EntryType ||
      !CaretakerName
    ) {
      return res.status(400).json({ message: "ENTER ALL FIELDS" });
    }

    const existingStudent = await Student.findOne({ Name });

    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found!" });
    }

    const caretaker = await Caretaker.findOne({ Name: CaretakerName });

    if (!caretaker) {
      return res.status(404).json({ message: "Student not found!" });
    }

    const InDateTime = new Date();

    const Genralpassnew = await new GeneralPass({
      OutDateTime,
      InDateTime,
      Place,
      Purpose,
      Status,
      approved,
      EntryType,
      StudentId: existingStudent._id,
      CaretakerId: caretaker._id,
    });

    console.log(Genralpassnew);

    await Genralpassnew.save();

    return res
      .status(201)
      .json({ message: "Genralpassnew genrated ....", data: Genralpassnew });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "ERROR ON Genralpassnew !", err: error.message });
  }
};

export const GenralpassDetalis = async (req, res) => {
  try {
    const details = await GeneralPass.find().populate("StudentId").populate("CaretakerId");

    if (!details) {
      return res.status(500).json({ message: "NO Genralpass RECORDS YET !" });
    }

    return res
      .status(200)
      .json({ message: "All ATTENDACE RECORDS !", data: details });
  } catch (error) {
    return res.status(200).json({
      message: " error on get ATTENDACE RECORDS !",
      error: error.message,
    });
  }
};

export const UpdateGenralpass = async (req, res) => {
  try {
    const {
      _id,
      Name,
      Place,
      Purpose,
      Status,
      approved,
      OutDateTime,
      EntryType,
      CaretakerName,
    } = req.body;

    if (!_id) {
      return res
        .status(400)
        .json({ message: "Provide Genralpass ID to update" });
    }

    if (
      !Name ||
       !Place ||
      !Purpose ||
      !OutDateTime ||
      !Status ||
      !approved ||
      !CaretakerName
    ) {
      return res.status(400).json({ message: "ENTER ALL FIELDS" });
    }

    const existingStudent = await Student.findOne({ Name });
    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found!" });
    }

    const caretaker = await Caretaker.findOne({Name:CaretakerName});
    if (!caretaker) {
      return res.status(404).json({ message: "Caretaker not found!" });
    }

    const InDateTime = new Date();
    const updatedGenralpass = await GeneralPass.findByIdAndUpdate(
      _id,
      {
        OutDateTime,
        InDateTime,
        Place,
        Purpose,
        Status,
        approved,
        EntryType,
        StudentId: existingStudent._id,
        CaretakerId: caretaker._id,
      },
      { new: true }
    );

    if (!updatedGenralpass) {
      return res.status(404).json({ message: "Genralpass record not found!" });
    }

    return res.status(200).json({
      message: "Genralpass updated successfully",
      data: updatedGenralpass,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while updating genralpass",
      error: error.message,
    });
  }
};

export const DeleteGenralpass = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res
        .status(400)
        .json({ message: "Provide genaral pass ID to delete" });
    }

    const deletedGenralpass = await GeneralPass.findByIdAndDelete(_id);

    if (!deletedGenralpass) {
      return res.status(404).json({ message: "Genralpass record not found!" });
    }

    return res.status(200).json({
      message: "deletedGenralpass  successfully",
      data: deletedGenralpass,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while deleting genralpass",
      error: error.message,
    });
  }
};
