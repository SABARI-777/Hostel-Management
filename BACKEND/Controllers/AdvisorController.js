import Advisor from "../MODELS/AdvisorModel.js";
import User from "../MODELS/UserModel.js";
import DepartmentModel from "../MODELS/DepartmentModel.js";

// ---------------- CREATE ----------------
export const AddAdvisor = async (req, res) => {
  try {
    const { Name, Email, Password, Designation, DepartmentName } = req.body;

    // Validate input
    if (!Name || !Email || !Password || !Designation || !DepartmentName) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find existing user by email only
    const existingUser = await User.findOne({ Email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "User not found with this email." });
    }

    // Validate department
    const department = await DepartmentModel.findOne({ DepartmentName });
    if (!department) {
      return res.status(404).json({ message: "Department not found." });
    }

    // Check if advisor already exists
    const existingAdvisor = await Advisor.findOne({ UserId: existingUser._id });
    if (existingAdvisor) {
      return res.status(400).json({
        message: "Advisor already exists for this user.",
        data: existingAdvisor,
      });
    }

    // Create new advisor
    const newAdvisor = new Advisor({
      Name,
      Designation,
      UserId: existingUser._id,
      DepartmentId: department._id,
    });

    await newAdvisor.save();

    return res.status(201).json({
      message: "Advisor created successfully",
      data: newAdvisor,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error creating advisor", error: err.message });
  }
};

// ---------------- READ ----------------
export const getAdvisor = async (req, res) => {
  try {
    const advisors = await Advisor.find()
      .populate("DepartmentId")
      .populate("UserId");

    if (!advisors || advisors.length === 0) {
      return res.status(404).json({ message: "No advisors found" });
    }

    return res.status(200).json({ message: "All advisors", data: advisors });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching advisors", error: err.message });
  }
};

// ---------------- UPDATE ----------------
export const UpdateAdvisor = async (req, res) => {
  try {
    const { _id, Name, Designation, DepartmentName } = req.body;

    if (!_id || !Name || !Designation || !DepartmentName) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find department
    const department = await DepartmentModel.findOne({ DepartmentName });
    if (!department) {
      return res.status(404).json({ message: "Department not found." });
    }

    const updatedAdvisor = await Advisor.findByIdAndUpdate(
      _id,
      { Name, Designation, DepartmentId: department._id },
      { new: true }
    )
      .populate("DepartmentId")
      .populate("UserId");

    if (!updatedAdvisor) {
      return res.status(404).json({ message: "Advisor not found." });
    }

    return res
      .status(200)
      .json({ message: "Advisor updated successfully", data: updatedAdvisor });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error updating advisor", error: err.message });
  }
};

// ---------------- DELETE ----------------
export const DeleteAdvisor = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ message: "Advisor ID is required." });
    }

    const deletedAdvisor = await Advisor.findByIdAndDelete(_id);
    if (!deletedAdvisor) {
      return res.status(404).json({ message: "Advisor not found." });
    }

    return res.status(200).json({
      message: "Advisor deleted successfully",
      data: deletedAdvisor,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error deleting advisor", error: err.message });
  }
};
