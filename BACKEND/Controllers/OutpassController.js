import OutPass from "../MODELS/OutpassModel.js";
import Student from "../MODELS/Studentmodel.js";
import Caretaker from "../MODELS/Caretakermodel.js";
import Counter from "../MODELS/CounterModel.js";
import Room from "../MODELS/RoomModel.js";

// ---------------- CREATE ----------------
export const GenerateOutpass = async (req, res) => {
  try {
    const {
      Name,
      Year,
      Place,
      Purpose,
      OutDateTime,
      InDateTime,
      EntryType,
      CaretakerName,
      Status,
      approved,
      ExpectedInDateTime,
    } = req.body;

    if (
      !Name || !Year || !Place || !Purpose ||
      !OutDateTime || !EntryType || !CaretakerName
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const student = await Student.findOne({ Name });
    if (!student) return res.status(404).json({ message: "Student not found!" });

    const caretaker = await Caretaker.findOne({ Name: CaretakerName });
    if (!caretaker) return res.status(404).json({ message: "Caretaker not found!" });

    // 🛡️ Block Isolation Check
    const studentRoom = await Room.findById(student.RoomId);
    if (studentRoom && studentRoom.HostelBlock !== caretaker.HostelBlock) {
      return res.status(403).json({ 
        message: `Block mismatch! You are in Block ${studentRoom.HostelBlock}, but selected a caretaker from Block ${caretaker.HostelBlock}.` 
      });
    }

    // 🔢 Get Unique PassId
    const counter = await Counter.findOneAndUpdate(
      { id: "home_pass_id" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const outpass = new OutPass({
      PassId: `H${counter.seq}`,
      OutDateTime,
      InDateTime: InDateTime || null,
      ExpectedInDateTime: ExpectedInDateTime || InDateTime || null,
      StudentId: student._id,
      CaretakerId: caretaker._id,
      Place,
      Purpose,
      Status: Status || "PENDING",
      approved: approved || false,
      EntryType,
    });

    await outpass.save();

    return res.status(201).json({
      message: "Outpass generated successfully",
      data: outpass,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error generating outpass", error: error.message });
  }
};

// ---------------- READ ----------------
export const GetOutpassDetails = async (req, res) => {
  try {
    const details = await OutPass.find()
      .populate({ path: "StudentId", populate: { path: "DepartmentId" } })
      .populate("CaretakerId");

    if (!details || details.length === 0) {
      return res.status(404).json({ message: "No outpass records found." });
    }

    return res.status(200).json({
      message: "All outpass records",
      data: details,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching outpass records", error: error.message });
  }
};

// ---------------- UPDATE ----------------
export const UpdateOutpass = async (req, res) => {
  try {
    const {
      _id, Name, Year, Place, Purpose, Status,
      approved, OutDateTime, CaretakerName, EntryType,
    } = req.body;

    if (!_id) return res.status(400).json({ message: "Outpass ID is required." });

    const student = await Student.findOne({ Name });
    if (!student) return res.status(404).json({ message: "Student not found!" });

    const caretaker = await Caretaker.findOne({ Name: CaretakerName });
    if (!caretaker) return res.status(404).json({ message: "Caretaker not found!" });

    const updated = await OutPass.findByIdAndUpdate(
      _id,
      {
        OutDateTime,
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

    if (!updated) return res.status(404).json({ message: "Outpass not found." });

    return res.status(200).json({
      message: "Outpass updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating outpass", error: error.message });
  }
};

// ---------------- DELETE ----------------
export const DeleteOutpass = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) return res.status(400).json({ message: "Outpass ID is required." });

    const deleted = await OutPass.findByIdAndDelete(_id);
    if (!deleted) return res.status(404).json({ message: "Outpass not found." });

    return res.status(200).json({
      message: "Outpass deleted successfully",
      data: deleted,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting outpass", error: error.message });
  }
};
