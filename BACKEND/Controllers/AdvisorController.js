import Advisor from "../MODELS/AdvisorModel.js";
import User from "../MODELS/UserModel.js";
import DepartmentModel from "../MODELS/DepartmentModel.js";

export const AddAdvisor = async (req, res) => {
  try {
    const { Name, Email, Password, Designation, DepartmentName } = req.body;

    if (!Name || !Email || !Password || !Designation || !DepartmentName) {
      return res.status(500).json({ message: "All fields are required." });
    }

    const existinguser = await User.findOne({ Email, Password });

    console.log(existinguser);

    if (!existinguser) {
      return res.status.json({
        message: "User user details on this email and password :",
        data: existinguser,
      });
    }

    const department = await DepartmentModel.findOne({ DepartmentName });

    console.log(department);

    if (!department) {
      return res.status(500).json({
        message: "department  details this :",
      });
    }

    const existadvisor = await Advisor.findOne({ UserId: existinguser._id });

    if (existadvisor) {
      return res
        .status(400)
        .json({ message: "alredy advisor details ", data: existadvisor });
    }

    const newAdvisor = await new Advisor({
      Name,
      Designation,
      UserId: existinguser._id,
      DepartmentId: department._id,
    });

    await newAdvisor.save();

    return res.status(201).json({
      message: "new advisor created successfully :",
      data: newAdvisor,
    });
  } catch (err) {
    res.status(400).json({ message: "error ", err: err });
  }
};

export const getAdvisor = async (req, res) => {
  try {
    const advisor = await Advisor.find()
      .populate("DepartmentId")
      .populate("UserId");

    if (!advisor) {
      return res.status(500).json({ message: "no advisor detail" });
    }

    return res
      .status(201)
      .json({ message: "all advisor details:", data: advisor });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "not fetch the advisor details :", error: err });
  }
};
export const UpdateAdvisor = async (req, res) => {

  try {
    

  const { _id, Name, Designation, DepartmentName } = req.body;

  if (!Name  || !_id || !Designation || !DepartmentName) {
    return res.status(401).json({ message: "enter all required fields :" });
  }

  const advisor = await Advisor.findOne({_id});

  if (!advisor) {
    return res
      .status(401)
      .json({ message: "no advisor detail", data: advisor });
  }

  const updatedadvisor = await Advisor.findOneAndUpdate(
    { _id },
    { Name, Designation,DepartmentName}
  ).populate("DepartmentId").populate("UserId");

  await updatedadvisor.save();

  return  res.status(201).json({message:"Updated successfully :",data:updatedadvisor});

  } catch (err) {
     return res.status(500).json({
      message: "Error update advisor",
      error: err.message,
    });
  }
};

export const DeleteAdvisor = async (req, res) => {
  try {
    const { _id } = req.body;

    const advisor = await Advisor.findByIdAndDelete({ _id });

    if (!advisor) {
      return res.status(404).json({ message: "Advisor not found" });
    }

    return res.status(200).json({
      message: "Advisor deleted successfully",
      data: advisor,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error deleting advisor",
      error: err.message,
    });
  }
};
