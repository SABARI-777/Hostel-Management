import DepartmentModel from "../MODELS/DepartmentModel.js";
import Student from "../MODELS/Studentmodel.js";
import Advisor from "../MODELS/AdvisorModel.js";

// ================== CREATE DEPARTMENT ==================
export const AddDepartment = async (req, res) => {
  try {
    const { DepartmentName, HodName } = req.body;

    if (!DepartmentName || !HodName) {
      return res.status(400).json({ message: "Department Name and HOD Name are required." });
    }

    // Prevent duplicate department creation
    const existingDept = await DepartmentModel.findOne({ DepartmentName });
    if (existingDept) {
      return res.status(409).json({ message: "Department already exists." });
    }

    const department = new DepartmentModel({ DepartmentName, HodName });
    await department.save();

    return res.status(201).json({
      message: "Department added successfully.",
      data: department,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error adding department.",
      error: err.message,
    });
  }
};

// ================== GET ALL DEPARTMENTS ==================
export const GetDepartments = async (req, res) => {
  try {
    const departments = await DepartmentModel.find();

    if (!departments || departments.length === 0) {
      return res.status(404).json({ message: "No departments found." });
    }

    return res.status(200).json({
      message: "Departments fetched successfully.",
      data: departments,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching departments.", error: err.message });
  }
};

// ================== UPDATE DEPARTMENT ==================
export const UpdateDepartment = async (req, res) => {
  try {
    const { _id, DepartmentName, HodName } = req.body;

    if (!_id || !DepartmentName || !HodName) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const department = await DepartmentModel.findByIdAndUpdate(
      _id,
      { DepartmentName, HodName },
      { new: true }
    );

    if (!department) {
      return res.status(404).json({ message: "Department not found." });
    }

    return res.status(200).json({
      message: "Department updated successfully.",
      data: department,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error updating department.", error: err.message });
  }
};

// ================== DELETE DEPARTMENT ==================
export const DeleteDepartment = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Department ID is required." });
    }

    // Protection: Check for linked advisors or students
    const linkedAdvisor = await Advisor.findOne({ DepartmentId: _id });
    if (linkedAdvisor) {
      return res.status(400).json({ message: "Cannot delete Department. One or more Advisors are still linked to this department." });
    }

    const linkedStudent = await Student.findOne({ DepartmentId: _id });
    if (linkedStudent) {
      return res.status(400).json({ message: "Cannot delete Department. One or more Students are still linked to this department." });
    }

    const department = await DepartmentModel.findByIdAndDelete(_id);

    if (!department) {
      return res.status(404).json({ message: "Department not found." });
    }

    return res.status(200).json({
      message: "Department deleted successfully.",
      data: department,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error deleting department.", error: err.message });
  }
};
