import Placement from "../MODELS/PlacementModel.js";

export const AddPlacement = async (req, res) => {
  try {
    const { BatchName, Days, ClassTiming, Status } = req.body;

    console.log(req.body);
    if (!BatchName || !Days || !ClassTiming || !Status) {
      return res.status(400).json({ message: "enter all fields !" });
    }

    const Batch = await new Placement({
      BatchName,
      Days,
      ClassTiming,
      Status,
    });

    await Batch.save();

    res.status(201).json({ message: "User Created Successfully", data: Batch });
  } catch (err) {
    return res.status(400).json({ error: true, message: err.message });
  }
};

export const GetBatch = async (req, res) => {
  try {
    const batchDetails = await Placement.find();

    if (!batchDetails) {
      return res.status.json({ message: "no batch detail " });
    }

    res.status(201).json({ message: "batch details", data: batchDetails });
  } catch (err) {
    return res.status(400).json({ error: true, message: err.message });
  }
};

export const UpdateBatch = async (req, res) => {
  try {
    const { id, BatchName, Days, ClassTiming, Status } = req.body;

    if (!BatchName || !id || !Days || !ClassTiming || !Status) {
      return res.status(400).json({ message: "enter id !" });
    }
    const batchDetails = await Placement.findOne({ _id: id });

    if (!batchDetails) {
      return res.status.json({ message: "no batch detail " });
    }

    const batch = await Placement.findOneAndUpdate(
      { _id: id },
      {
        BatchName,
        Days,
        ClassTiming,
        Status,
      },
      { new: true }
    );

    res
      .status(201)
      .json({ message: "batch updated successfully", data: batch });
  } catch (err) {
    return res.status(400).json({ error: true, message: err.message });
  }
};

export const DeleteBatch = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "enter id !" });
    }
    const batchDetails = await Placement.findOne({ _id: id });

    if (!batchDetails) {
      return res.status.json({ message: "no batch detail " });
    }

    const batch = await Placement.findOneAndDelete({ _id: id });

    res
      .status(201)
      .json({ message: "batch deleted successfully", data: batch });
  } catch (err) {
    return res.status(400).json({ error: true, message: err.message });
  }
};
