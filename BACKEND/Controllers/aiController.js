import { askOpenRouter } from "../utils/openRouter.js";
import Student from "../MODELS/Studentmodel.js";
import Caretaker from "../MODELS/Caretakermodel.js";
import Advisor from "../MODELS/AdvisorModel.js";
import Room from "../MODELS/RoomModel.js";
import OutPass from "../MODELS/OutpassModel.js";
import GeneralPass from "../MODELS/GeneralPassModel.js";
import EmergencyPass from "../MODELS/EmergencyPassModel.js";
import Department from "../MODELS/DepartmentModel.js";
import Placement from "../MODELS/PlacementModel.js";
import User from "../MODELS/UserModel.js";
import AttendanceDetails from "../MODELS/AttentanceModel.js";
import Complaint from "../MODELS/ComplaintModel.js";


export const chatWithAI = async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ success: false, message: "Question is required." });
    }

    const userRole = req.user?.role || "GUEST";
    const userId = req.user?.id;
    const userEmail = req.user?.email || "N/A";

    let databaseContext = "";
    let userName = "Guest";

    const formatPass = (p, type) => ({
      PassId: p.PassId,
      StudentName: p.StudentId?.Name || "Unknown",
      Type: type,
      Place: p.Place,
      Purpose: p.Purpose,
      Status: p.Status,
      Approved: p.approved || p.Approved || "NO",
      OutDateTime: p.OutDateTime,
      ExpectedInDateTime: p.ExpectedInDateTime,
      ActualInDateTime: p.ActualInDateTime,
      LateEntry: p.LateEntry || false
    });

    // Dynamic Context Gathering based on role
    if (userRole === "ADMIN") {
      userName = "Administrator";
      
      const totalStudents = await Student.countDocuments();
      const activeStudents = await Student.countDocuments({ Status: "ACTIVE" });
      const totalCaretakers = await Caretaker.countDocuments();
      const totalAdvisors = await Advisor.countDocuments();
      const totalRooms = await Room.countDocuments();
      
      const allRooms = await Room.find();
      let totalCapacity = 0;
      let totalOccupancy = 0;
      allRooms.forEach(r => {
        totalCapacity += (Number(r.Capacity) || 0);
        totalOccupancy += (Number(r.Occupancy) || 0);
      });

      const totalOutPasses = await OutPass.countDocuments();
      const totalGeneralPasses = await GeneralPass.countDocuments();
      const totalEmergencyPasses = await EmergencyPass.countDocuments();
      const totalPassesCount = totalOutPasses + totalGeneralPasses + totalEmergencyPasses;

      // Fetch all students
      const students = await Student.find()
        .populate("RoomId")
        .populate("DepartmentId")
        .populate("AdvisorId");

      // Fetch passes (sorted by newest, limit to 100 per type for token capacity safety)
      const outPasses = await OutPass.find().populate("StudentId").sort({ createdAt: -1 }).limit(100);
      const genPasses = await GeneralPass.find().populate("StudentId").sort({ createdAt: -1 }).limit(100);
      const emPasses = await EmergencyPass.find().populate("StudentId").sort({ createdAt: -1 }).limit(100);

      // Fetch attendance logs (limit to 200 for token capacity safety)
      const attendanceLogs = await AttendanceDetails.find().populate("StudentId").sort({ createdAt: -1 }).limit(200);

      // Fetch complaints
      const complaints = await Complaint.find().sort({ createdAt: -1 });
      const totalComplaints = complaints.length;
      const pendingComplaints = complaints.filter(c => c.Status === "PENDING").length;
      const resolvedComplaints = totalComplaints - pendingComplaints;

      // Map lists into clean JSON structures
      const studentsList = students.map(s => ({
        Name: s.Name,
        Gender: s.Gender,
        RollNumber: s.RollNumber,
        RegisterNumber: s.RegisterNumber,
        Section: s.Section,
        Department: s.DepartmentId?.DepartmentName || "N/A",
        Advisor: s.AdvisorId?.Name || "N/A",
        RoomNumber: s.RoomId?.RoomNumber || "N/A",
        HostelBlock: s.RoomId?.HostelBlock || "N/A",
        LateEntryCount: s.LateEntryCount || 0,
        Status: s.Status,
        ParentEmail: s.ParentEmail || "N/A",
        ParentMobile: s.ParentMobileNumber || "N/A"
      }));

      const passesList = [
        ...outPasses.map(p => formatPass(p, "Outpass")),
        ...genPasses.map(p => formatPass(p, "GeneralPass")),
        ...emPasses.map(p => formatPass(p, "EmergencyPass"))
      ];

      const attendanceList = attendanceLogs.map(a => ({
        StudentName: a.StudentId?.Name || "Unknown",
        Status: a.Status,
        InDateTime: a.InDateTime,
        EntryType: a.EntryType
      }));

      const complaintsList = complaints.map(c => ({
        Name: c.Name,
        RollOrRegNo: c.RollOrRegNo,
        RoomNo: c.RoomNo,
        Year: c.Year,
        Department: c.Department,
        Description: c.Description,
        Date: c.ComplaintDate,
        Time: c.Time,
        Status: c.Status
      }));

      databaseContext = `
=== SYSTEM OVERVIEW ===
- Total Registered Students: ${totalStudents} (${activeStudents} currently active)
- Total Staff: ${totalCaretakers} Caretakers, ${totalAdvisors} Advisors
- Housing: ${totalRooms} Rooms (Capacity: ${totalCapacity}, Occupied: ${totalOccupancy}, Vacant: ${totalCapacity - totalOccupancy})
- Total Gate Passes: ${totalPassesCount} (Outpass: ${totalOutPasses}, General: ${totalGeneralPasses}, Emergency: ${totalEmergencyPasses})
- Total Complaints: ${totalComplaints} (${pendingComplaints} pending, ${resolvedComplaints} resolved)

=== DETAILED STUDENT PROFILES ===
${JSON.stringify(studentsList, null, 2)}

=== DETAILED PASSES RECORD (RECENT PASSES) ===
${JSON.stringify(passesList, null, 2)}

=== DETAILED ATTENDANCE LOGS (RECENT LOGS) ===
${JSON.stringify(attendanceList, null, 2)}

=== DETAILED STUDENT COMPLAINTS ===
${JSON.stringify(complaintsList, null, 2)}
`;

    } else if (userRole === "STUDENT") {
      const student = await Student.findOne({ UserId: userId })
        .populate("RoomId")
        .populate("DepartmentId")
        .populate("AdvisorId");

      if (student) {
        userName = student.Name;
        
        const outPasses = await OutPass.find({ StudentId: student._id }).limit(20);
        const generalPasses = await GeneralPass.find({ StudentId: student._id }).limit(20);
        const emergencyPasses = await EmergencyPass.find({ StudentId: student._id }).limit(20);

        const passHistory = [
          ...outPasses.map(p => formatPass(p, "Outpass")),
          ...generalPasses.map(p => formatPass(p, "GeneralPass")),
          ...emergencyPasses.map(p => formatPass(p, "EmergencyPass"))
        ];

        const attendanceLogs = await AttendanceDetails.find({ StudentId: student._id }).sort({ createdAt: -1 }).limit(100);
        const attendanceList = attendanceLogs.map(a => ({
          Status: a.Status,
          InDateTime: a.InDateTime,
          EntryType: a.EntryType
        }));

        // Fetch student complaints
        const studentComplaints = await Complaint.find({ StudentUserId: userId }).sort({ createdAt: -1 });
        const studentComplaintsList = studentComplaints.map(c => ({
          Description: c.Description,
          RoomNo: c.RoomNo,
          Date: c.ComplaintDate,
          Time: c.Time,
          Status: c.Status
        }));

        databaseContext = `
Student Profile Details:
- Name: ${student.Name}
- Gender: ${student.Gender}
- Enrollment Year: ${student.StartYear}
- Section: ${student.Section}
- Roll Number: ${student.RollNumber}
- Register Number: ${student.RegisterNumber}
- Department: ${student.DepartmentId?.DepartmentName || "N/A"}
- Advisor Name: ${student.AdvisorId?.Name || "N/A"}
- Room Number: ${student.RoomId?.RoomNumber || "N/A"} (Hostel Block: ${student.RoomId?.HostelBlock || "N/A"})
- Parent Correspondence Email: ${student.ParentEmail || "N/A"}
- Parent Contact Mobile: ${student.ParentMobileNumber || "N/A"}
- Total Personal Late Entry Record Count: ${student.LateEntryCount || 0}
- Current Status: ${student.Status}

=== YOUR PASS REQUEST HISTORY ===
${JSON.stringify(passHistory, null, 2)}

=== YOUR ATTENDANCE HISTORY ===
${JSON.stringify(attendanceList, null, 2)}

=== YOUR SUBMITTED COMPLAINTS ===
${JSON.stringify(studentComplaintsList, null, 2)}
`;
      } else {
        databaseContext = `No student profile details found. Complete your student profile configuration first.`;
      }

    } else if (userRole === "CARETAKER") {
      const caretaker = await Caretaker.findOne({ UserID: userId });
      
      if (caretaker) {
        userName = caretaker.Name;
        
        const roomsInBlock = await Room.find({ HostelBlock: caretaker.HostelBlock });
        const roomIds = roomsInBlock.map(r => r._id);
        const studentsInBlock = await Student.find({ RoomId: { $in: roomIds } }).populate("RoomId").populate("DepartmentId");
        const studentIds = studentsInBlock.map(s => s._id);

        const outPasses = await OutPass.find({ StudentId: { $in: studentIds } }).populate("StudentId");
        const genPasses = await GeneralPass.find({ StudentId: { $in: studentIds } }).populate("StudentId");
        const emPasses = await EmergencyPass.find({ StudentId: { $in: studentIds } }).populate("StudentId");

        const passesList = [
          ...outPasses.map(p => formatPass(p, "Outpass")),
          ...genPasses.map(p => formatPass(p, "GeneralPass")),
          ...emPasses.map(p => formatPass(p, "EmergencyPass"))
        ];

        const attendanceLogs = await AttendanceDetails.find({ StudentId: { $in: studentIds } }).populate("StudentId").sort({ createdAt: -1 }).limit(100);
        const attendanceList = attendanceLogs.map(a => ({
          StudentName: a.StudentId?.Name || "Unknown",
          Status: a.Status,
          InDateTime: a.InDateTime,
          EntryType: a.EntryType
        }));

        databaseContext = `
Block ${caretaker.HostelBlock} Caretaker Details:
- Name: ${caretaker.Name}
- Block: ${caretaker.HostelBlock}

=== BLOCK STATISTICS ===
- Total Rooms: ${roomsInBlock.length}
- Total Block Students: ${studentsInBlock.length}

=== BLOCK STUDENTS PROFILES ===
${JSON.stringify(studentsInBlock.map(s => ({
  Name: s.Name,
  Room: s.RoomId?.RoomNumber,
  Department: s.DepartmentId?.DepartmentName,
  LateEntryCount: s.LateEntryCount || 0
})), null, 2)}

=== BLOCK PASSES RECORD ===
${JSON.stringify(passesList, null, 2)}

=== BLOCK ATTENDANCE LOGS ===
${JSON.stringify(attendanceList, null, 2)}
`;
      } else {
        databaseContext = `Caretaker profile details not found.`;
      }

    } else if (userRole === "ADVISOR") {
      const advisor = await Advisor.findOne({ UserId: userId }).populate("DepartmentId");
      
      if (advisor) {
        userName = advisor.Name;
        const studentsAdvised = await Student.find({ AdvisorId: advisor._id }).populate("RoomId").populate("DepartmentId");
        const studentIds = studentsAdvised.map(s => s._id);

        const outPasses = await OutPass.find({ StudentId: { $in: studentIds } }).populate("StudentId");
        const genPasses = await GeneralPass.find({ StudentId: { $in: studentIds } }).populate("StudentId");
        const emPasses = await EmergencyPass.find({ StudentId: { $in: studentIds } }).populate("StudentId");

        const passesList = [
          ...outPasses.map(p => formatPass(p, "Outpass")),
          ...genPasses.map(p => formatPass(p, "GeneralPass")),
          ...emPasses.map(p => formatPass(p, "EmergencyPass"))
        ];

        const attendanceLogs = await AttendanceDetails.find({ StudentId: { $in: studentIds } }).populate("StudentId").sort({ createdAt: -1 }).limit(100);
        const attendanceList = attendanceLogs.map(a => ({
          StudentName: a.StudentId?.Name || "Unknown",
          Status: a.Status,
          InDateTime: a.InDateTime,
          EntryType: a.EntryType
        }));

        databaseContext = `
Advisor Profile:
- Name: ${advisor.Name}
- Designation: ${advisor.Designation}
- Department: ${advisor.DepartmentId?.DepartmentName}

=== ADVISED STUDENTS PROFILES ===
${JSON.stringify(studentsAdvised.map(s => ({
  Name: s.Name,
  RollNumber: s.RollNumber,
  Section: s.Section,
  Room: s.RoomId?.RoomNumber,
  LateEntryCount: s.LateEntryCount || 0,
  Status: s.Status
})), null, 2)}

=== ADVISED STUDENTS PASSES ===
${JSON.stringify(passesList, null, 2)}

=== ADVISED STUDENTS ATTENDANCE ===
${JSON.stringify(attendanceList, null, 2)}
`;
      } else {
        databaseContext = `Advisor profile details not found.`;
      }
    }

    const systemPrompt = `You are the official AI Assistant for the Hostel Management System.
Your job is to assist the user by answering queries based ONLY on the current database state provided below.

=== USER INFORMATION ===
Name: ${userName}
Email: ${userEmail}
Role: ${userRole}

=== CURRENT SYSTEM DATABASE STATE ===
${databaseContext}

=== INSTRUCTIONS ===
1. Use the provided Database State to answer user questions about summaries, reports, pass lists, rooms, or late entries.
2. If the user asks for details about themselves (e.g. "summary about me", "how many late count about me"), look up their corresponding section in the Database State.
3. If the user asks for summaries or percentages (like attendance percentage or pass ratios) for a specific student, use the attendance logs or passes lists to count and calculate it on the fly!
4. Be professional, friendly, and act like a real, helpful human assistant. Do not say "based on the provided JSON data..." or "according to the context...". Instead, speak naturally as if you directly know the system state (e.g., "SABARI has an attendance rate of 95% with 2 late entries...").
5. Format lists or stats in clean markdown bullet points, bold highlights, or tables.
6. Keep security in mind: do not disclose database IDs (like _id) to the user unless explicitly requested.
7. If the database state is empty or does not contain records for their query, state this politely (e.g., "According to current records...").
8. If the user asks general questions unrelated to the hostel management system, you can answer them politely but keep the focus on hostel context.

Question: "${question}"
Answer:`;

    const answer = await askOpenRouter(systemPrompt);

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while compiling AI response: " + error.message,
    });
  }
};