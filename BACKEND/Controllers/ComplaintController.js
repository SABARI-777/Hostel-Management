import Complaint from "../MODELS/ComplaintModel.js";

// Submit a new complaint
export const submitComplaint = async (req, res) => {
  try {
    const { Name, RollOrRegNo, RoomNo, Year, Department, Description, ComplaintDate, Time } = req.body;

    if (!Name || !RollOrRegNo || !RoomNo || !Year || !Department || !Description || !Time) {
      return res.status(400).json({
        success: false,
        message: "Missing required complaint fields (Name, Roll/Reg, Room Number, Year, Dept, Description, Time).",
      });
    }

    const newComplaint = new Complaint({
      StudentUserId: req.user.id,
      Name,
      RollOrRegNo,
      RoomNo,
      Year,
      Department,
      Description,
      ComplaintDate: ComplaintDate ? new Date(ComplaintDate) : new Date(),
      Time,
      Status: "PENDING",
    });

    await newComplaint.save();

    return res.status(201).json({
      success: true,
      message: "Complaint submitted successfully.",
      data: newComplaint,
    });
  } catch (error) {
    console.error("Error submitting complaint:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while submitting complaint: " + error.message,
    });
  }
};

// Retrieve student's own complaints
export const getStudentComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ StudentUserId: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: complaints,
    });
  } catch (error) {
    console.error("Error fetching student complaints:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while fetching complaints: " + error.message,
    });
  }
};

// Retrieve all complaints (Admin/Caretakers)
export const getAdminComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: complaints,
    });
  } catch (error) {
    console.error("Error fetching admin complaints:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while fetching complaints: " + error.message,
    });
  }
};

// Update status of complaint to RESOLVED
export const resolveComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { Status: "RESOLVED" },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Complaint resolved successfully.",
      data: complaint,
    });
  } catch (error) {
    console.error("Error resolving complaint:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while resolving complaint: " + error.message,
    });
  }
};
