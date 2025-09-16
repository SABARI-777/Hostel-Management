import OutPass from "../MODELS/OutpassModel.js";
import Student from "../MODELS/Studentmodel.js";
import Caretaker from "../MODELS/Caretakermodel.js";

export const GentrateOutpass = async (req, res) => {
  try {
    const { Name, Year, Place, Purpose, Status, approved, OutDateTime } =
      req.body;

    if (
      !Name ||
      !Year ||
      !Place ||
      !Purpose ||
      !OutDateTime ||
      !Status ||
      !approved
    ) {
      return res.status(400).json({ message: "ENTER ALL FIELDS" });
    }

    const existingStudent = await Student.findOne({ Name });

    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found!" });
    }

    const caretaker = await Caretaker.findOne(
      existingStudent.RoomId.HostelBlock
    );

    if (!caretaker) {
      return res.status(404).json({ message: "Student not found!" });
    }

    const InDateTime = new Date();

    const Outpassnew = await new OutPass({
      OutDateTime,
      InDateTime,
      StudentId: existingStudent._id,
      CaretakerId: caretaker._id,
      Place,
      Purpose,
      Status,
      approved,
    });

    await Outpassnew.save();

    await Outpassnew.populate("StudentId").populate("CaretakerId");

    return res
      .status(201)
      .json({ message: "outpass genrated ....", data: Outpassnew });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "ERROR ON OUTPASSS !", err: error.message });
  }
};

export const GetoutpassDetails = async (req, res) => {
  try {
    const details = await OutPass.find()
      .populate("StudentId")
      .populate("CaretakerId");

    if (!details) {
      return res.status(500).json({ message: "NO OUTPASS RECORDS YET !" });
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

export const UpdateOutpass = async (req, res) => {
  try {
    const { _id, Name, Place, Purpose, Status, approved, OutDateTime } =
      req.body;

    if (!_id) {
      return res.status(400).json({ message: "Provide Outpass ID to update" });
    }

    const existingStudent = await Student.findOne({ Name });
    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found!" });
    }

    const caretaker = await Caretaker.findOne(
      existingStudent.RoomId.HostelBlock
    );
    if (!caretaker) {
      return res.status(404).json({ message: "Caretaker not found!" });
    }

    const updatedOutpass = await OutPass.findByIdAndUpdate(
      _id,
      {
        OutDateTime,
        Place,
        Purpose,
        Status,
        approved,
        StudentId: existingStudent._id,
        CaretakerId: caretaker._id,
      },
      { new: true }
    )
      .populate("StudentId")
      .populate("CaretakerId");

    if (!updatedOutpass) {
      return res.status(404).json({ message: "Outpass record not found!" });
    }

    return res.status(200).json({
      message: "Outpass updated successfully",
      data: updatedOutpass,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while updating Outpass",
      error: error.message,
    });
  }
};

export const DeleteOutpass = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Provide Outpass ID to delete" });
    }

    const deletedOutpass = await OutPass.findByIdAndDelete(_id);

    if (!deletedOutpass) {
      return res.status(404).json({ message: "Outpass record not found!" });
    }

    return res.status(200).json({
      message: "Outpass deleted successfully",
      data: deletedOutpass,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while deleting Outpass",
      error: error.message,
    });
  }
};
