import OutPass from "../Models/OutpassModel.js";
import GeneralPass from "../Models/GeneralPassModel.js";
import EmergencyPass from "../Models/EmergencyPassModel.js";
import Student from "../Models/Studentmodel.js";
import User from "../Models/UserModel.js";
import { sendLateEntryEmail } from "../utils/sendEmail.js";

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
    pass.approved = "YES";
    pass.Status = "OUT";
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
    pass.approved = "CANCELL";
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

export const MarkEntry = async (req, res) => {
  try {
    const { _id, Type } = req.body;

    if (!_id || !Type) {
      return res.status(400).json({ message: "Pass ID and Type are required" });
    }

    let PassModel;
    switch (Number(Type)) {
      case 1: PassModel = OutPass; break;
      case 2: PassModel = GeneralPass; break;
      case 3: PassModel = EmergencyPass; break;
      default: return res.status(400).json({ message: "Invalid Pass Type" });
    }

    const pass = await PassModel.findById(_id).populate("StudentId");

    if (!pass) {
      return res.status(444).json({ message: "Pass not found" });
    }

    if (pass.Status === "IN") {
       return res.status(400).json({ message: "Student has already been marked as returned." });
    }

    const now = new Date();
    pass.ActualInDateTime = now;
    pass.Status = "IN";

    // Expected In vs Actual In
    const expected = pass.ExpectedInDateTime || pass.InDateTime || pass.OutDateTime; 

    if (expected && now > new Date(expected)) {
      pass.LateEntry = true;
      
      const student = await Student.findById(pass.StudentId._id);
      if (student) {
        student.LateEntryCount = (student.LateEntryCount || 0) + 1;
        await student.save();

        // Notify Parent
        const targetEmail = student.ParentEmail || null;
        if (targetEmail) {
           await sendLateEntryEmail(targetEmail, student.Name, expected, now, pass);
        } else {
           const userAccount = await User.findById(student.UserId);
           if (userAccount && userAccount.Email) {
              await sendLateEntryEmail(userAccount.Email, student.Name, expected, now, pass);
           }
        }
      }
    }

    await pass.save();

    return res.status(200).json({
      message: "Student marked as returned successfully",
      late: pass.LateEntry,
      data: pass
    });
  } catch (error) {
    return res.status(500).json({ message: "Error marking entry", error: error.message });
  }
};
