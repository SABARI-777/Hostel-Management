// -------------------- EmergencyPass Controller --------------------
import EmergencyPass from "../MODELS/EmergencyPassModel.js";
import Student from "../MODELS/Studentmodel.js";
import Caretaker from "../MODELS/Caretakermodel.js";

export const createEmergencyPass = async (req, res) => {
  try {
    const {
      Name,
      Year,
      Document,
      Place,
      Purpose,
      Status,
      approved,
      OutDateTime,
      EntryType,
      CaretakerName,
    } = req.body;

    if (!Name) return res.status(400).json({ message: "Name is required" });
    if (!Year) return res.status(400).json({ message: "Year is required" });
    if (!Document)
      return res.status(400).json({ message: "Document is required" });
    if (!Place) return res.status(400).json({ message: "Place is required" });
    if (!Purpose)
      return res.status(400).json({ message: "Purpose is required" });
    if (!OutDateTime)
      return res.status(400).json({ message: "OutDateTime is required" });
    if (!Status) return res.status(400).json({ message: "Status is required" });
    // if (approved === undefined) return res.status(400).json({ message: "Approved is required" });
    if (!EntryType)
      return res.status(400).json({ message: "EntryType is required" });
    if (!CaretakerName)
      return res.status(400).json({ message: "CaretakerName is required" });

    const student = await Student.findOne({ Name });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const caretaker = await Caretaker.findOne({ Name: CaretakerName });
    if (!caretaker)
      return res.status(404).json({ message: "Caretaker not found" });

    const InDateTime = new Date();

    const newEmergencyPass = new EmergencyPass({
      OutDateTime,
      InDateTime,
      Document,
      Year,
      Place,
      Purpose,
      Status,
      approved,
      EntryType,
      StudentId: student._id,
      CaretakerId: caretaker._id,
    });

    await newEmergencyPass.save();
    return res.status(201).json({
      message: "EmergencyPass created successfully",
      data: newEmergencyPass,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating EmergencyPass", error: error.message });
  }
};

export const updateEmergencyPass = async (req, res) => {
  try {
    const {
      _id,
      Name,
      Year,
      Document,
      Place,
      Purpose,
      Status,
      approved,
      OutDateTime,
      EntryType,
      CaretakerName,
    } = req.body;

    if (!_id) return res.status(400).json({ message: "_id is required" });
    if (!Name) return res.status(400).json({ message: "Name is required" });
    if (!Year) return res.status(400).json({ message: "Year is required" });
    if (!Document)
      return res.status(400).json({ message: "Document is required" });
    if (!Place) return res.status(400).json({ message: "Place is required" });
    if (!Purpose)
      return res.status(400).json({ message: "Purpose is required" });
    if (!OutDateTime)
      return res.status(400).json({ message: "OutDateTime is required" });
    if (!Status) return res.status(400).json({ message: "Status is required" });
    if (approved === undefined)
      return res.status(400).json({ message: "Approved is required" });
    if (!EntryType)
      return res.status(400).json({ message: "EntryType is required" });
    if (!CaretakerName)
      return res.status(400).json({ message: "CaretakerName is required" });

    const student = await Student.findOne({ Name });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const caretaker = await Caretaker.findOne({ Name: CaretakerName });
    if (!caretaker)
      return res.status(404).json({ message: "Caretaker not found" });

    const updatedEmergencyPass = await EmergencyPass.findByIdAndUpdate(
      _id,
      {
        OutDateTime,
        InDateTime: new Date(),
        Document,
        Year,
        Place,
        Purpose,
        Status,
        approved,
        EntryType,
        StudentId: student._id,
        CaretakerId: caretaker._id,
      },
      { new: true }
    );

    if (!updatedEmergencyPass)
      return res
        .status(404)
        .json({ message: "EmergencyPass record not found" });

    return res.status(200).json({
      message: "EmergencyPass updated successfully",
      data: updatedEmergencyPass,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating EmergencyPass", error: error.message });
  }
};

export const deleteEmergencyPass = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id)
      return res.status(400).json({ message: "_id is required to delete" });

    const deletedEmergencyPass = await EmergencyPass.findByIdAndDelete(_id);
    if (!deletedEmergencyPass)
      return res
        .status(404)
        .json({ message: "EmergencyPass record not found" });

    return res.status(200).json({
      message: "EmergencyPass deleted successfully",
      data: deletedEmergencyPass,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting EmergencyPass", error: error.message });
  }
};

export const getEmergencyPassDetails = async (req, res) => {
  try {
    const details = await EmergencyPass.find()
      .populate("StudentId")
      .populate("CaretakerId");
    if (!details || details.length === 0)
      return res.status(404).json({ message: "No EmergencyPass records yet" });
    return res
      .status(200)
      .json({ message: "All EmergencyPass records", data: details });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching EmergencyPass records",
      error: error.message,
    });
  }
};
