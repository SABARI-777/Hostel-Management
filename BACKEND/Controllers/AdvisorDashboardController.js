import Advisor from "../Models/AdvisorModel.js";
import Student from "../Models/Studentmodel.js";

/**
 * Controller to fetch all students assigned to the logged-in Advisor.
 * The advisor is identified by the req.user.id (from JWT).
 */
export const GetAdvisorStudents = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Find the Advisor profile linked to this User ID
    const advisor = await Advisor.findOne({ UserId: userId });
    
    if (!advisor) {
      return res.status(404).json({ 
        success: false, 
        message: "Advisor profile not found for this user." 
      });
    }

    // 2. Find all students assigned to this Advisor
    const students = await Student.find({ AdvisorId: advisor._id })
      .populate("DepartmentId")
      .populate("RoomId")
      .populate("UserId");

    return res.status(200).json({
      success: true,
      message: "Advisor students fetched successfully",
      count: students.length,
      data: students
    });

  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      message: "Error fetching advisor students", 
      error: err.message 
    });
  }
};
