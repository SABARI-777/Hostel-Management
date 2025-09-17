import OutPass from "../MODELS/OutpassModel.js";
import GeneralPass from "../MODELS/GeneralPassModel.js";
import EmergencyPass from "../MODELS/EmergencyPassModel.js";

export const MakeApprove = async (req, res) => {
  try {
    const { _id, Type } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Pass ID is required" });
    }

    if (!Type) {
      return res
        .status(400)
        .json({ message: "Type is required and must be 1, 2, or 3" });
    }

    let PassModel;
    switch (Number(Type)) {
      case 1:
        PassModel = OutPass;
        break;
      case 2:
        PassModel = GeneralPass;
        break;
      case 3:
        PassModel = EmergencyPass;
        break;
    }

    const pass = await PassModel.findById(_id).populate("CaretakerId");

    if (!pass) {
      return res.status(404).json({ message: "Pass not found for this ID" });
    }

    if (!pass.CaretakerId) {
      return res
        .status(404)
        .json({ message: "Caretaker not found for this pass" });
    }

    pass.Approved = "YES";
    await pass.save();

    return res.status(200).json({
      message: "Pass approved successfully",
      data: pass,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error during approval", error: error.message });
  }
};


export const CancelApprove = async (req, res) => {
  try {
    const { _id, Type } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Pass ID is required" });
    }

    if (!Type) {
      return res
        .status(400)
        .json({ message: "Type is required and must be 1, 2, or 3" });
    }

    let PassModel;
    switch (Number(Type)) {
      case 1:
        PassModel = OutPass;
        break;
      case 2:
        PassModel = GeneralPass;
        break;
      case 3:
        PassModel = EmergencyPass;
        break;
    }

    const pass = await PassModel.findById(_id).populate("CaretakerId");

    if (!pass) {
      return res.status(404).json({ message: "Pass not found for this ID" });
    }

    if (!pass.CaretakerId) {
      return res
        .status(404)
        .json({ message: "Caretaker not found for this pass" });
    }

    pass.Approved = "CANCELL";
    await pass.save();

    return res.status(200).json({
      message: "Pass approved successfully",
      data: pass,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error during approval", error: error.message });
  }
};
