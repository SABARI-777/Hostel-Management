import Student from "../MODELS/Studentmodel.js";
import Caretaker from "../MODELS/Caretakermodel.js";
import Room from "../MODELS/RoomModel.js";
import OutPass from "../MODELS/OutpassModel.js";
import GeneralPass from "../MODELS/GeneralPassModel.js";
import EmergencyPass from "../MODELS/EmergencyPassModel.js";
import AttendanceDetails from "../MODELS/AttentanceModel.js";
import PlacementAttendanceDetails from "../MODELS/PlacementAttendenceModel.js";
import Department from "../MODELS/DepartmentModel.js";
import Placement from "../MODELS/PlacementModel.js";

export const GetCaretakerDashboardStats = async (req, res) => {
  try {
    const { caretakerId } = req.body; // Expect Caretaker ID or User ID sent from frontend

    if (!caretakerId) {
      return res.status(400).json({ message: "Caretaker ID is required" });
    }

    // Attempt to find Caretaker either directly by their ID, or by their associated User ID
    let caretaker = await Caretaker.findById(caretakerId).populate("UserID");
    if (!caretaker) {
       caretaker = await Caretaker.findOne({ UserID: caretakerId }).populate("UserID");
       if(!caretaker) {
          return res.status(444).json({ message: `Caretaker not found in DB for ID: ${caretakerId}. Ensure this user is added as a Caretaker in the Admin panel.` });
       }
    }

    const assignedBlock = caretaker.HostelBlock;
    const isInactive = caretaker.Status !== "ACTIVE";

    if (!assignedBlock && !isInactive) {
      return res.status(400).json({ message: "Caretaker has no assigned hostel block." });
    }

    if (isInactive) {
      return res.status(200).json({
        success: true,
        data: {
          profile: {
            Name: caretaker.Name,
            Block: assignedBlock || "Unassigned",
            Status: caretaker.Status
          },
          isInactive: true,
          message: "Your account is currently INACTIVE. Please contact the Administrator for access to block details."
        }
      });
    }

    // 1. Get Room Stats for the specific block
    const blockRooms = await Room.find({ HostelBlock: assignedBlock });
    let totalCapacity = 0;
    let totalOccupancy = 0;
    const roomIds = [];

    blockRooms.forEach(r => {
      totalCapacity += (Number(r.Capacity) || 0);
      totalOccupancy += (Number(r.Occupancy) || 0);
      roomIds.push(r._id);
    });

    const totalVacant = totalCapacity - totalOccupancy;

    // 2. Get Students for the specific block
    const blockStudents = await Student.find({ RoomId: { $in: roomIds } })
                                       .populate("RoomId")
                                       .populate("DepartmentId");
    
    // Calculate simple status breakdown
    const studentStatus = { ACTIVE: 0, INACTIVE: 0, GRADUATED: 0, DROPPED: 0, PENDING: 0 };
    blockStudents.forEach(s => {
       if (studentStatus[s.Status] !== undefined) {
          studentStatus[s.Status]++;
       }
    });

    // 3. Get Passes assigned to this Caretaker
    const cId = caretaker._id;
    const outPasses = await OutPass.find({ CaretakerId: cId });
    const generalPasses = await GeneralPass.find({ CaretakerId: cId });
    const emergencyPasses = await EmergencyPass.find({ CaretakerId: cId });

    let pendingPasses = 0;
    let approvedPasses = 0;
    let cancelledPasses = 0;

    const countPassStatus = (passList) => {
       passList.forEach(p => {
          if (p.Approved === "YES" || p.approved === "YES") approvedPasses++;
          else if (p.Approved === "CANCELL" || p.approved === "CANCELL" || p.Approved === "CANCELLED") cancelledPasses++;
          else pendingPasses++; // Neither explicitly yes nor cancelled
       });
    };

    countPassStatus(outPasses);
    countPassStatus(generalPasses);
    countPassStatus(emergencyPasses);

    return res.status(200).json({
      success: true,
      data: {
        profile: {
          Name: caretaker.Name,
          Block: assignedBlock,
          Status: caretaker.Status
        },
        infrastructure: {
          totalRooms: blockRooms.length,
          totalCapacity,
          totalOccupancy,
          totalVacant
        },
        students: {
          total: blockStudents.length,
          status: studentStatus,
          list: blockStudents // returning the list alongside stats for easier frontend usage
        },
        passes: {
          total: outPasses.length + generalPasses.length + emergencyPasses.length,
          pending: pendingPasses,
          approved: approvedPasses,
          cancelled: cancelledPasses,
          outPasses,
          generalPasses,
          emergencyPasses
        }
      }
    });

  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};
// --- Helper to get Caretaker by ID or UserID ---
const findCaretaker = async (id) => {
  let ct = await Caretaker.findById(id);
  if (!ct) ct = await Caretaker.findOne({ UserID: id });
  return ct;
};

// --- Get Full Students List for Block ---
export const GetCaretakerStudentsList = async (req, res) => {
  try {
    const { caretakerId } = req.body;
    const ct = await findCaretaker(caretakerId);
    if (!ct) return res.status(404).json({ message: "Caretaker not found" });
    if (ct.Status !== "ACTIVE") {
      return res.status(403).json({ success: false, message: "Access Denied: Account is INACTIVE", isInactive: true });
    }
    if (!ct.HostelBlock) return res.status(404).json({ message: "Caretaker Block not assigned" });

    const rooms = await Room.find({ HostelBlock: ct.HostelBlock });
    const roomIds = rooms.map(r => r._id);
    const students = await Student.find({ RoomId: { $in: roomIds } })
      .populate("RoomId")
      .populate("DepartmentId");

    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Get Detailed Passes for Block ---
export const GetCaretakerPassesList = async (req, res) => {
  try {
    const { caretakerId } = req.body;
    const ct = await findCaretaker(caretakerId);
    if (!ct) return res.status(404).json({ message: "Caretaker not found" });

    if (ct.Status !== "ACTIVE") {
      return res.status(403).json({ success: false, message: "Access Denied: Account is INACTIVE", isInactive: true });
    }

    const [out, gen, em] = await Promise.all([
      OutPass.find({ CaretakerId: ct._id }).populate("StudentId"),
      GeneralPass.find({ CaretakerId: ct._id }).populate("StudentId"),
      EmergencyPass.find({ CaretakerId: ct._id }).populate("StudentId")
    ]);

    res.status(200).json({ 
      success: true, 
      data: { outPasses: out, generalPasses: gen, emergencyPasses: em } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Get Attendance Logs for Block ---
export const GetCaretakerAttendanceLogs = async (req, res) => {
  try {
    const { caretakerId } = req.body;
    const ct = await findCaretaker(caretakerId);
    if (!ct) return res.status(404).json({ message: "Caretaker not found" });

    if (ct.Status !== "ACTIVE") {
        return res.status(403).json({ success: false, message: "Access Denied: Account is INACTIVE", isInactive: true });
    }

    if (!ct.HostelBlock) return res.status(404).json({ message: "Caretaker or Block not found" });

    const rooms = await Room.find({ HostelBlock: ct.HostelBlock });
    const roomIds = rooms.map(r => r._id);
    const logs = await AttendanceDetails.find({ RoomId: { $in: roomIds } })
      .populate({ path: "StudentId", populate: { path: "DepartmentId" } })
      .populate("RoomId")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Get Placement Attendance Logs for Block ---
export const GetCaretakerPlacementAttendanceLogs = async (req, res) => {
  try {
    const { caretakerId } = req.body;
    const ct = await findCaretaker(caretakerId);
    if (!ct) return res.status(404).json({ message: "Caretaker not found" });

    if (ct.Status !== "ACTIVE") {
        return res.status(403).json({ success: false, message: "Access Denied: Account is INACTIVE", isInactive: true });
    }

    if (!ct.HostelBlock) return res.status(404).json({ message: "Caretaker or Block not found" });

    const rooms = await Room.find({ HostelBlock: ct.HostelBlock });
    const roomIds = rooms.map(r => r._id);
    const logs = await PlacementAttendanceDetails.find({ RoomId: { $in: roomIds } })
      .populate({ path: "StudentId", populate: { path: "DepartmentId" } })
      .populate("RoomId")
      .populate("PlacementId")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
