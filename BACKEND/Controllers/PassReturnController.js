import OutPass from "../Models/OutpassModel.js";
import GeneralPass from "../Models/GeneralPassModel.js";
import EmergencyPass from "../Models/EmergencyPassModel.js";
import Student from "../Models/Studentmodel.js";
import User from "../Models/UserModel.js";
import { sendLateEntryEmail } from "../utils/sendEmail.js";

export const ProcessPassReturn = async (req, res) => {
  try {
    let { PassId } = req.body;
    if (!PassId) {
      return res.status(400).json({ message: "Pass ID is required." });
    }

    PassId = PassId.toString().trim().toUpperCase();

    // 🔍 Search in all three pass collections
    const findPass = async (id) => {
      let p = await OutPass.findOne({ PassId: id }).populate("StudentId");
      if (p) return { p, model: OutPass };
      p = await GeneralPass.findOne({ PassId: id }).populate("StudentId");
      if (p) return { p, model: GeneralPass };
      p = await EmergencyPass.findOne({ PassId: id }).populate("StudentId");
      if (p) return { p, model: EmergencyPass };
      return null;
    };

    let result = await findPass(PassId);
    
    // If not found, try common prefixes if the input is numeric
    if (!result && /^\d+$/.test(PassId)) {
       const prefixes = ["H", "N", "E"];
       for (const pre of prefixes) {
          result = await findPass(`${pre}${PassId}`);
          if (result) break;
       }
    }

    if (!result) {
      return res.status(404).json({ message: "Gate Pass not found!" });
    }

    const { p: pass, model: PassModel } = result;

    if (pass.approved !== "YES" && pass.Approved !== "YES") {
      return res.status(400).json({ message: "This pass has not been approved yet." });
    }

    if (pass.Status === "IN") {
      return res.status(400).json({ message: "This pass is already marked as returned." });
    }

    const now = new Date();
    const expectedTime = pass.ExpectedInDateTime || pass.InDateTime || pass.OutDateTime; 
    
    let isLate = false;
    if (expectedTime && now > new Date(expectedTime)) {
      isLate = true;
    }

    // Update Pass
    pass.ActualInDateTime = now;
    pass.Status = "IN";
    pass.LateEntry = isLate;
    await pass.save();

    // 📧 Update Student & Send Late Entry Email
    if (isLate && pass.StudentId) {
       // Support both populated and unpopulated StudentId
       const studentLookupId = (pass.StudentId && pass.StudentId._id) ? pass.StudentId._id : pass.StudentId;
       const student = await Student.findById(studentLookupId);
       if (student) {
         // Increment Late Entry Count
         student.LateEntryCount = (student.LateEntryCount || 0) + 1;
         await student.save();

         // Notify Parent
         const targetEmail = student.ParentEmail || null;
         
         if (targetEmail) {
            await sendLateEntryEmail(targetEmail, student.Name, expectedTime, now, pass);
         } else {
            // Fallback to student's own email if parent email is somehow missing
            const userAccount = await User.findById(student.UserId);
            if (userAccount && userAccount.Email) {
               await sendLateEntryEmail(userAccount.Email, student.Name, expectedTime, now, pass);
            }
         }
       }
    }

    return res.status(200).json({
      success: true,
      message: isLate ? "Returned LATE. Record updated and notification sent." : "Returned safely on time.",
      data: pass,
      isLate
    });

  } catch (error) {
    console.error("Pass Return Error Details:", {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    return res.status(500).json({ 
      error: true, 
      message: "An internal server error occurred while processing the pass return.", 
      details: error.message 
    });
  }
};

export const GetPassByUniqueId = async (req, res) => {
    try {
        let { PassId } = req.params;
        if (!PassId) return res.status(400).json({ message: "Pass ID is required" });
        PassId = PassId.toString().trim().toUpperCase();
        const findPass = async (id) => {
            let p = await OutPass.findOne({ PassId: id }).populate({ path: "StudentId", populate: { path: "DepartmentId" } });
            if (p) return p;
            p = await GeneralPass.findOne({ PassId: id }).populate({ path: "StudentId", populate: { path: "DepartmentId" } });
            if (p) return p;
            p = await EmergencyPass.findOne({ PassId: id }).populate({ path: "StudentId", populate: { path: "DepartmentId" } });
            if (p) return p;
            return null;
        };

        let pass = await findPass(PassId);
        if (!pass && /^\d+$/.test(PassId)) {
            const prefixes = ["H", "N", "E"];
            for (const pre of prefixes) {
                pass = await findPass(`${pre}${PassId}`);
                if (pass) break;
            }
        }

        if (!pass) return res.status(404).json({ message: "Pass not found" });

        return res.status(200).json({ data: pass });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching pass", error: err.message });
    }
}
