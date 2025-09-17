import Placement from "../MODELS/PlacementModel.js";

// ---------------- CREATE ----------------
export const AddPlacement = async (req, res) => {
  try {
    const { BatchName, Days, ClassTiming, Status } = req.body;

    if (!BatchName || !Days || !ClassTiming || !Status) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newBatch = new Placement({
      BatchName,
      Days,
      ClassTiming,
      Status,
    });

    await newBatch.save();

    return res.status(201).json({
      message: "Batch created successfully",
      data: newBatch,
    });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};

// ---------------- READ ----------------
export const GetBatch = async (req, res) => {
  try {
    const batchDetails = await Placement.find();

    if (!batchDetails || batchDetails.length === 0) {
      return res.status(404).json({ message: "No batch details found." });
    }

    return res.status(200).json({
      message: "Batch details fetched successfully",
      data: batchDetails,
    });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};

// ---------------- UPDATE ----------------
export const UpdateBatch = async (req, res) => {
  try {
    const { id, BatchName, Days, ClassTiming, Status } = req.body;

    if (!id || !BatchName || !Days || !ClassTiming || !Status) {
      return res.status(400).json({ message: "All fields including id are required." });
    }

    const updatedBatch = await Placement.findByIdAndUpdate(
      id,
      { BatchName, Days, ClassTiming, Status },
      { new: true }
    );

    if (!updatedBatch) {
      return res.status(404).json({ message: "Batch not found." });
    }

    return res.status(200).json({
      message: "Batch updated successfully",
      data: updatedBatch,
    });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};

// ---------------- DELETE ----------------
export const DeleteBatch = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Batch id is required." });
    }

    const deletedBatch = await Placement.findByIdAndDelete(id);

    if (!deletedBatch) {
      return res.status(404).json({ message: "Batch not found." });
    }

    return res.status(200).json({
      message: "Batch deleted successfully",
      data: deletedBatch,
    });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
};
