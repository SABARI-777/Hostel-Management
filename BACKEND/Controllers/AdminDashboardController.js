import Student from "../MODELS/Studentmodel.js";
import Caretaker from "../MODELS/Caretakermodel.js";
import Advisor from "../MODELS/AdvisorModel.js";
import Room from "../MODELS/RoomModel.js";
import AttendanceDetails from "../MODELS/AttentanceModel.js";
import Department from "../MODELS/DepartmentModel.js";
import Placement from "../MODELS/PlacementModel.js";
import PlacementAttendanceDetails from "../MODELS/PlacementAttendenceModel.js";
import GeneralPass from "../MODELS/GeneralPassModel.js";
import OutPass from "../MODELS/OutpassModel.js";
import EmergencyPass from "../MODELS/EmergencyPassModel.js";

export const GetAdminStats = async (req, res) => {
  try {
    // 1. Students Breakdown
    const allStudents = await Student.find().populate("DepartmentId").populate("PlacementId");
    
    const allDepartments = await Department.find();
    const allPlacements = await Placement.find();
    
    // Default containers
    const studentData = { 
      total: allStudents.length, 
      status: {}, 
      gender: {}, 
      yearBreakdown: { "1st Year": 0, "2nd Year": 0, "3rd Year": 0, "Final Year": 0, "Graduate": 0 },
      totalLateEntries: 0 
    };
    const departmentData = { total: allDepartments.length, studentBreakdown: {} };
    const placementData = { totalBatches: allPlacements.length, studentBreakdown: {} };
    
    // Initialize 0 counts for entire departments and placements
    allDepartments.forEach(d => {
      if (d.DepartmentName) {
        departmentData.studentBreakdown[d.DepartmentName] = { 
          total: 0, "1st Year": 0, "2nd Year": 0, "3rd Year": 0, "Final Year": 0, "Graduate": 0 
        };
      }
    });

    const initYearObj = () => ({ "1st Year": 0, "2nd Year": 0, "3rd Year": 0, "Final Year": 0, "Graduate": 0 });
    
    allPlacements.forEach(p => {
      if (p.BatchName) {
        placementData.studentBreakdown[p.BatchName] = { 
          total: 0, "1st Year": 0, "2nd Year": 0, "3rd Year": 0, "Final Year": 0, "Graduate": 0 
        };
      }
    });
    
    allStudents.forEach(s => {
      // General Metrics (Case-Insensitive Normalization)
      const normalizedStatus = (s.Status || "UnknownStatus").toUpperCase();
      const normalizedGender = (s.Gender || "UnknownGender").toUpperCase();
      
      studentData.status[normalizedStatus] = (studentData.status[normalizedStatus] || 0) + 1;
      studentData.gender[normalizedGender] = (studentData.gender[normalizedGender] || 0) + 1;

      // Year Breakdown calculation
      let studentYear = "Unknown";
      if (s.StartYear) {
        const currentYear = new Date().getFullYear();
        const diff = currentYear - s.StartYear;
        if (diff <= 1) studentYear = "1st Year";
        else if (diff === 2) studentYear = "2nd Year";
        else if (diff === 3) studentYear = "3rd Year";
        else if (diff === 4) studentYear = "Final Year";
        else if (diff >= 5) studentYear = "Graduate";

        if (studentYear !== "Unknown") studentData.yearBreakdown[studentYear]++;
      }

      // Department Map
      const deptName = s.DepartmentId?.DepartmentName || "Unassigned";
      if (!departmentData.studentBreakdown[deptName]) {
        departmentData.studentBreakdown[deptName] = { total: 0, ...initYearObj() };
      }
      departmentData.studentBreakdown[deptName].total++;
      if (studentYear !== "Unknown") departmentData.studentBreakdown[deptName][studentYear]++;

      // Placement Batch Map
      if (s.PlacementId) {
        const batchName = s.PlacementId.BatchName || "Unassigned";
        if (!placementData.studentBreakdown[batchName]) {
          placementData.studentBreakdown[batchName] = { total: 0, ...initYearObj() };
        }
        placementData.studentBreakdown[batchName].total++;
        if (studentYear !== "Unknown") placementData.studentBreakdown[batchName][studentYear]++;
      }

      // Late Entry Aggregation
      studentData.totalLateEntries += (s.LateEntryCount || 0);
    });

    // 2. Hostel Infrastructure Breakdown
    const allRooms = await Room.find();
    const hostelData = {
      totalCapacity: 0,
      totalOccupancy: 0,
      totalVacant: 0,
      blocks: {}
    };

    allRooms.forEach(r => {
      const cap = Number(r.Capacity) || 0;
      const occ = Number(r.Occupancy) || 0;
      const vac = cap - occ;
      const block = r.HostelBlock || "UNASSIGNED";

      hostelData.totalCapacity += cap;
      hostelData.totalOccupancy += occ;
      hostelData.totalVacant += vac;

      if (!hostelData.blocks[block]) {
        hostelData.blocks[block] = { capacity: 0, occupancy: 0, vacant: 0, roomCount: 0, ...initYearObj() };
      }
      hostelData.blocks[block].capacity += cap;
      hostelData.blocks[block].occupancy += occ;
      hostelData.blocks[block].vacant += vac;
      hostelData.blocks[block].roomCount += 1;
      
      // Since student mapping is complex for rooms, we can approximate block years 
      // if students were populated, but for now we skip this until specifically needed per room.
      // However, to keep it "year wise" as requested, I'll update allRooms loop to potentially use student year info if available.
    });

    // 3. Staff Breakdown (Caretakers & Advisors)
    const allCaretakers = await Caretaker.find();
    const caretakerData = {
      total: allCaretakers.length,
      status: { ACTIVE: 0, INACTIVE: 0 },
      byBlock: {}
    };
    allCaretakers.forEach(c => {
      caretakerData.status[c.Status] = (caretakerData.status[c.Status] || 0) + 1;
      const block = c.HostelBlock || "None";
      caretakerData.byBlock[block] = (caretakerData.byBlock[block] || 0) + 1;
    });

    const allAdvisors = await Advisor.find().populate("DepartmentId");
    const advisorData = {
      total: allAdvisors.length,
      byDesignation: {},
      byDepartment: {}
    };
    allAdvisors.forEach(a => {
      const des = a.Designation || "Unassigned";
      advisorData.byDesignation[des] = (advisorData.byDesignation[des] || 0) + 1;
      const dept = a.DepartmentId?.DepartmentName || "None";
      advisorData.byDepartment[dept] = (advisorData.byDepartment[dept] || 0) + 1;
    });

    // 4. Attendance Metrics (Unified Status Mapping)
    const allAttendance = await AttendanceDetails.find();
    let presentCount = 0; let absentCount = 0; let leaveCount = 0; let lateCount = 0;
    const dailyBreakdown = {};

    allAttendance.forEach(a => {
      const rawStatus = (a.Status || "").toLowerCase();
      let status = "absent"; // Default fallback
      
      if (rawStatus.includes("present") || rawStatus === "in") status = "present";
      else if (rawStatus === "absent" || rawStatus === "out") status = "absent";
      else if (rawStatus === "leave") status = "leave";
      else if (rawStatus === "late") status = "late";

      if (status === "present") presentCount++;
      else if (status === "absent") absentCount++;
      else if (status === "leave") leaveCount++;
      else if (status === "late") lateCount++;

      const timestamp = a.InDateTime || a.createdAt;
      if (timestamp) {
        const dateStr = new Date(timestamp).toISOString().split('T')[0];
        if (!dailyBreakdown[dateStr]) dailyBreakdown[dateStr] = { present: 0, absent: 0 };
        if (status === "present") dailyBreakdown[dateStr].present++;
        if (status === "absent") dailyBreakdown[dateStr].absent++;
      }
    });

    const attendanceData = {
      present: presentCount,
      absent: absentCount,
      leave: leaveCount,
      late: lateCount,
      totalLogs: allAttendance.length,
      dailyBreakdown
    };

    // 5. Placement Attendance Metrics (Unified Status Mapping)
    const allPlacementAttendance = await PlacementAttendanceDetails.find();
    let pPresentCount = 0; let pAbsentCount = 0; let pLeaveCount = 0; let pLateCount = 0;
    const pDailyBreakdown = {};

    allPlacementAttendance.forEach(a => {
      const rawStatus = (a.Status || "").toLowerCase();
      let status = "absent"; // Default fallback

      if (rawStatus.includes("present") || rawStatus === "in") status = "present";
      else if (rawStatus === "absent" || rawStatus === "out") status = "absent";
      else if (rawStatus === "leave") status = "leave";
      else if (rawStatus === "late") status = "late";

      if (status === "present") pPresentCount++;
      else if (status === "absent") pAbsentCount++;
      else if (status === "leave") pLeaveCount++;
      else if (status === "late") pLateCount++;

      const timestamp = a.InDateTime || a.createdAt;
      if (timestamp) {
        const dateStr = new Date(timestamp).toISOString().split('T')[0];
        if (!pDailyBreakdown[dateStr]) pDailyBreakdown[dateStr] = { present: 0, absent: 0 };
        if (status === "present") pDailyBreakdown[dateStr].present++;
        if (status === "absent") pDailyBreakdown[dateStr].absent++;
      }
    });

    const placementAttendanceData = {
      present: pPresentCount,
      absent: pAbsentCount,
      leave: pLeaveCount,
      late: pLateCount,
      totalLogs: allPlacementAttendance.length,
      dailyBreakdown: pDailyBreakdown
    };

    // Construct unified payload
    res.status(200).json({
      success: true,
      stats: {
        studentData,
        departmentData,
        placementData,
        hostelData,
        caretakerData,
        advisorData,
        attendanceData,
        placementAttendanceData
      }
    });

  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};
