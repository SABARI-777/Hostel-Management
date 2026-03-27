import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../AdminDashboard/AdminDashboard.css";

import { API } from "../../apiConfig";

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkInPassId, setCheckInPassId] = useState("");
  const [processingReturn, setProcessingReturn] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [activeView, setActiveView] = useState("dashboard"); // "dashboard", "history", "profile"
  const calculateYear = (startYear) => {
    if (!startYear) return "N/A";
    const currentYear = new Date().getFullYear();
    const diff = currentYear - startYear;
    if (diff <= 1) return "1st Year";
    if (diff === 2) return "2nd Year";
    if (diff === 3) return "3rd Year";
    if (diff === 4) return "Final Year";
    if (diff >= 5) return "Graduate";
    return "N/A";
  };

  // Data for forms
  const [departments, setDepartments] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [batches, setBatches] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [caretakers, setCaretakers] = useState([]);

  // Pass data
  const [myPasses, setMyPasses] = useState([]);
  const [showPassModal, setShowPassModal] = useState(false);
  const [passForm, setPassForm] = useState({
    type: "home",
    Place: "",
    Purpose: "",
    OutDateTime: "",
    ExpectedInDateTime: "",
    EntryType: "MANUAL",
    CaretakerName: ""
  });

  // Profile form
  const [profileForm, setProfileForm] = useState({
    Name: "", Gender: "", StartYear: "", Section: "A", RollNumber: "", 
    RegisterNumber: "", ParentMobileNumber: "", ParentEmail: "", DepartmentName: "", 
    BatchName: "", RoomNumber: "", AdvisorName: ""
  });

  const navigate = useNavigate();

  const fetchDropdownData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { "Authorization": `Bearer ${token}` };
      const [depRes, roomRes, batchRes, advRes, ctRes] = await Promise.all([
        fetch(`${API}/Admin/departments/d/details`, { headers }),
        fetch(`${API}/Admin/rooms/room/details`, { headers }),
        fetch(`${API}/Admin/placements/b/details`, { headers }),
        fetch(`${API}/Admin/advisors/a/details`, { headers }),
        fetch(`${API}/Admin/caretakers/ct/details/`, { headers })
      ]);
      const depData = await depRes.json();
      const roomData = await roomRes.json();
      const batchData = await batchRes.json();
      const advData = await advRes.json();
      const ctData = await ctRes.json();
      setDepartments(depData.data || []);
      setRooms(roomData.data || []);
      setBatches(batchData.data || []);
      setAdvisors(advData.data || []);
      setCaretakers(ctData.data || []);
    } catch (err) { console.error("Error fetching dropdowns:", err); }
  };

  const fetchMyPasses = async (studentId) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { "Authorization": `Bearer ${token}` };
      const [genRes, emRes, outRes] = await Promise.all([
        fetch(`${API}/Admin/passes/general/g/entry/details`, { headers }),
        fetch(`${API}/Admin/passes/emergency/e/entry/details`, { headers }),
        fetch(`${API}/Admin/passes/out/o/entry/details`, { headers })
      ]);
      const gData = await genRes.json();
      const eData = await emRes.json();
      const oData = await outRes.json();
      const allPasses = [
        ...(gData.data || []).map(p => ({ ...p, passType: 'GENERAL PASS' })),
        ...(eData.data || []).map(p => ({ ...p, passType: 'EMERGENCY PASS' })),
        ...(oData.data || []).map(p => ({ ...p, passType: 'OUTPASS (HOME)' }))
      ].filter(p => String(p.StudentId?._id) === String(studentId) || String(p.StudentId) === String(studentId));
      setMyPasses(allPasses);
    } catch (err) { console.error("Error fetching passes:", err); }
  };

  const checkProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/student/student/profile`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setStudentProfile(data.data);
        fetchMyPasses(data.data._id);
      }
    } catch (err) { console.error("Error checking profile:", err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.background = '#0d0f1a';
    document.body.style.minHeight = '100vh';

    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedUser || loggedUser.Type !== "STUDENT") {
      navigate("/login");
      return;
    }
    setUser(loggedUser);
    checkProfile();
    fetchDropdownData();
  }, []);



  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/student/add/student`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ ...profileForm, Email: user.Email, Status: "ACTIVE" })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Configuration Applied Successfully!");
        checkProfile();
      } else { alert(data.message || "Failed to configure profile."); }
    } catch (err) { alert("Network Error"); }
  };

  const handlePassRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      let endpoint = `${API}/Admin/passes/general/g/entry/add`;
      if (passForm.type === 'emergency') endpoint = `${API}/Admin/passes/emergency/e/entry/add`;
      if (passForm.type === 'outpass') endpoint = `${API}/Admin/passes/out/o/entry/add`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          ...passForm,
          CaretakerName: passForm.CaretakerName || (caretakers.filter(c => c.HostelBlock === studentProfile?.RoomId?.HostelBlock)[0]?.Name || ""),
          Name: studentProfile.Name,
          Year: calculateYear(studentProfile.StartYear),
          Status: "OUT",
          approved: "NO",
          Document: passForm.type === 'emergency' ? "Self-certified Emergency" : undefined
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Request Submitted for Review!");
        setShowPassModal(false);
        fetchMyPasses(studentProfile._id);
      } else { alert(data.message || "Failed to submit request."); }
    } catch (err) { alert("Network Error"); }
  };

  const handleStudentCheckIn = async (e) => {
    e.preventDefault();
    if (!checkInPassId) return;
    setProcessingReturn(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/Admin/passes/return/pass/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ PassId: checkInPassId })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Arrival Confirmed! Status Updated.");
        setCheckInPassId("");
        fetchMyPasses(studentProfile._id);
      } else { alert(data.message || "Invalid Pass ID or Unauthorized."); }
    } catch (err) { alert("Return Verification Failed."); }
    finally { setProcessingReturn(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword && false) { // Not using confirm field in UI yet
        // skip
    }
    setIsChangingPassword(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/Admin/users/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordStatus({ type: "success", text: "Secret Updated Successfully!" });
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else { setPasswordStatus({ type: "error", text: data.message || "Rotation Failed." }); }
    } catch (err) { setPasswordStatus({ type: "error", text: "Network Error" }); }
    finally { setIsChangingPassword(false); setTimeout(() => setPasswordStatus(null), 3000); }
  };

  const theme = {
    primary: '#10b981', // Emerald
    secondary: '#06b6d4', // Cyan
    accent: '#f97316', // Orange/Amber
    success: '#059669', // Deep Emerald
    bg: 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)',
    card: 'rgba(255, 255, 255, 0.8)',
    border: '1px solid rgba(16, 185, 129, 0.1)',
    text: '#064e3b', // Deep Emerald Text
    muted: '#6b7280'
  };

  const containerStyle = { 
    minHeight: '100vh', 
    width: '100%',
    background: theme.bg, 
    color: theme.text, 
    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
    boxSizing: 'border-box'
  };

  const cardStyle = { 
    background: theme.card, 
    backdropFilter: 'blur(20px)', 
    borderRadius: '28px', 
    padding: '30px', 
    border: theme.border, 
    boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.4s ease'
  };

  const inputStyle = { 
    background: 'rgba(255, 255, 255, 0.9)', 
    color: theme.text, 
    border: '1px solid rgba(0, 0, 0, 0.1)', 
    padding: '14px 18px', 
    borderRadius: '16px', 
    width: '100%', 
    boxSizing: 'border-box',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease'
  };

  const btnStyle = { 
    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`, 
    color: '#fff', 
    border: 'none', 
    borderRadius: '16px', 
    padding: '14px 28px', 
    cursor: 'pointer', 
    fontWeight: '800', 
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    boxShadow: `0 8px 20px rgba(16, 185, 129, 0.2)`,
    transition: 'all 0.3s ease'
  };

  if (loading) return (
    <div style={{ ...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes luxurySpin { to { transform: rotate(360deg); } }
      `}</style>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '60px', height: '60px', border: '3px solid rgba(0,0,0,0.05)', borderTopColor: theme.primary, borderRadius: '50%', animation: 'luxurySpin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite', margin: '0 auto 25px' }}></div>
        <p style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '1.5px', color: theme.primary }}>LOADING PROFILE...</p>
      </div>
    </div>
  );

  // 1. COMPLETE PROFILE VIEW
  if (!studentProfile) {
    return (
      <div style={{ ...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <style>{` @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'); `}</style>
        <div style={{ ...cardStyle, maxWidth: '750px', width: '100%', padding: '50px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ color: theme.primary, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.8rem', marginBottom: '10px' }}>Setup Required</div>
            <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px' }}>Complete Your Profile</h2>
            <p style={{ color: theme.muted, marginTop: '5px' }}>Enter your academic and personal details for the hostel records.</p>
          </div>
          
          <form onSubmit={handleProfileSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '800', color: theme.muted, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Legal Identity</label>
                <input type="text" placeholder="Full Name as per Records" required style={inputStyle} onChange={(e) => setProfileForm({...profileForm, Name: e.target.value})} />
            </div>
            
            <select required style={inputStyle} onChange={(e) => setProfileForm({...profileForm, Gender: e.target.value})}>
              <option value="">Select Gender</option>
              {['MALE', 'FEMALE'].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            
            <input type="number" placeholder="Year of Enrollment" required style={inputStyle} onChange={(e) => setProfileForm({...profileForm, StartYear: e.target.value})} />
            <input type="text" placeholder="Roll Registry" required style={inputStyle} onChange={(e) => setProfileForm({...profileForm, RollNumber: e.target.value})} />
            <input type="text" placeholder="Official Register ID" required style={inputStyle} onChange={(e) => setProfileForm({...profileForm, RegisterNumber: e.target.value})} />
            <input type="text" placeholder="Family Contact" required style={inputStyle} onChange={(e) => setProfileForm({...profileForm, ParentMobileNumber: e.target.value})} />
            <input type="email" placeholder="Family Correspondence Email" required style={inputStyle} onChange={(e) => setProfileForm({...profileForm, ParentEmail: e.target.value})} />
            <input type="text" placeholder="Assigned Section" required style={inputStyle} onChange={(e) => setProfileForm({...profileForm, Section: e.target.value})} />

            <select required style={inputStyle} onChange={(e) => setProfileForm({...profileForm, DepartmentName: e.target.value})}>
              <option value="">Departmental Unit</option>
              {departments.map(d => <option key={d._id} value={d.DepartmentName}>{d.DepartmentName}</option>)}
            </select>
            
            <select required style={inputStyle} onChange={(e) => setProfileForm({...profileForm, RoomNumber: e.target.value})}>
              <option value="">Housing Assignment</option>
              {rooms.filter(r => r.Occupancy < r.Capacity).map(r => <option key={r._id} value={r.RoomNumber}>Room {r.RoomNumber} (Block {r.HostelBlock})</option>)}
            </select>

            <select required style={inputStyle} onChange={(e) => setProfileForm({...profileForm, BatchName: e.target.value})}>
              <option value="">Batch / Year</option>
              {batches.map(b => <option key={b._id} value={b.BatchName}>{b.BatchName}</option>)}
            </select>
            
            <select required style={inputStyle} onChange={(e) => setProfileForm({...profileForm, AdvisorName: e.target.value})}>
              <option value="">Academic Advisor</option>
              {advisors.map(a => <option key={a._id} value={a.Name}>{a.Name}</option>)}
            </select>

            <button type="submit" style={{ ...btnStyle, gridColumn: 'span 2', marginTop: '20px' }}>Apply Configuration</button>
          </form>
          <button onClick={handleLogout} style={{ width: '100%', marginTop: '20px', background: 'transparent', border: '1px solid rgba(0,0,0,0.05)', color: theme.muted, padding: '14px', borderRadius: '16px', cursor: 'pointer', fontWeight: '700' }}>Cancel & Exit</button>
        </div>
      </div>
    );
  }

  // 2. DASHBOARD VIEW
  return (
    <div style={containerStyle}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; border: 3px solid transparent; background-clip: content-box; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        .premium-row { transition: all 0.3s ease; }
        .premium-row:hover { background: rgba(0, 0, 0, 0.02) !important; transform: translateX(8px); }
        .glass-input:focus { border-color: ${theme.primary}; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); outline: none; }
        
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar */}
        <aside style={{ width: '300px', background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(30px)', borderRight: theme.border, padding: '50px 30px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '60px' }}>
            <div style={{ color: theme.primary, fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '5px' }}>Management</div>
            <div style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-1px', color: '#1e293b' }}>Student <span style={{ color: theme.primary }}>Portal</span></div>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <div 
              onClick={() => setActiveView("dashboard")}
              style={{ 
                padding: '16px 20px', 
                background: activeView === 'dashboard' ? 'white' : 'transparent', 
                borderRadius: '16px', 
                color: activeView === 'dashboard' ? theme.primary : theme.muted, 
                fontWeight: '800', 
                boxShadow: activeView === 'dashboard' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', 
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Dashboard
            </div>
            <div 
              onClick={() => setActiveView("history")}
              style={{ 
                padding: '16px 20px', 
                background: activeView === 'history' ? 'white' : 'transparent', 
                borderRadius: '16px', 
                color: activeView === 'history' ? theme.primary : theme.muted, 
                fontWeight: '800', 
                boxShadow: activeView === 'history' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', 
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              History
            </div>
            <div 
              onClick={() => setActiveView("profile")}
              style={{ 
                padding: '16px 20px', 
                background: activeView === 'profile' ? 'white' : 'transparent', 
                borderRadius: '16px', 
                color: activeView === 'profile' ? theme.primary : theme.muted, 
                fontWeight: '800', 
                boxShadow: activeView === 'profile' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', 
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              My Profile
            </div>
            
            <button onClick={handleLogout} style={{ marginTop: "auto", background: "rgba(249, 115, 22, 0.05)", border: "none", padding: '16px 20px', color: theme.accent, borderRadius: '16px', cursor: "pointer", fontWeight: '800' }}>Sign Out</button>
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{ padding: '60px 80px', flex: 1, overflowY: 'auto' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
            <div>
              <div style={{ color: theme.primary, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.85rem', marginBottom: '12px' }}>Welcome back</div>
              <h2 style={{ margin: 0, fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-2px', color: '#1e293b' }}>{studentProfile.Name}</h2>
              <p style={{ color: theme.muted, fontSize: '1.2rem', marginTop: '8px' }}>Security Status: <b>VERIFIED</b> <span style={{ opacity: 0.3, margin: '0 10px' }}>|</span> Room <b>{studentProfile.RoomId?.RoomNumber}</b></p>
            </div>
            <button onClick={() => setShowPassModal(true)} style={btnStyle}>New Pass Request</button>
          </header>

          {activeView === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {/* ARRIVAL PROTOCOL CARD (QUICK ACCESS) */}
              <div style={cardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800', color: theme.success }}>Check-In</h3>
                    <span style={{ fontSize: '0.8rem', color: theme.muted, fontWeight: '700' }}>Verification Process</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 250px', gap: '20px', alignItems: 'center' }}>
                    <p style={{ margin: 0, color: theme.muted }}>Verify your return to campus by linkning your active Pass ID for digital verification.</p>
                    <form onSubmit={handleStudentCheckIn} style={{ display: 'flex', gap: '10px' }}>
                        <input 
                          type="text" 
                          placeholder="Pass ID" 
                          className="glass-input"
                          style={{ ...inputStyle, background: 'rgba(0,0,0,0.02)' }}
                          value={checkInPassId}
                          onChange={(e) => setCheckInPassId(e.target.value)}
                        />
                        <button type="submit" style={{ ...btnStyle, background: theme.success }}>Verify</button>
                    </form>
                  </div>
              </div>

              {/* QUICK STATS / CARDS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px' }}>
                  <div style={{ ...cardStyle, background: 'white' }}>
                      <div style={{ color: theme.muted, fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Recent Activity</div>
                      <div style={{ fontSize: '2.5rem', fontWeight: '900', color: theme.primary, marginTop: '5px' }}>{myPasses.filter(p => [ "NOT", "NO" ].includes(p.approved || p.Approved)).length}</div>
                      <div style={{ fontSize: '0.85rem', color: theme.muted }}>Requests Pending Review</div>
                  </div>
                  <div style={{ ...cardStyle, background: 'white' }}>
                      <div style={{ color: theme.muted, fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Hostel Discipline</div>
                      <div style={{ fontSize: '2.5rem', fontWeight: '900', color: theme.accent, marginTop: '5px' }}>{studentProfile.LateEntryCount || 0}</div>
                      <div style={{ fontSize: '0.85rem', color: theme.muted }}>Late Entry Records</div>
                  </div>
                  <div style={{ ...cardStyle, background: theme.primary, color: 'white' }}>
                      <div style={{ opacity: 0.7, fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Account Security</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: '800', marginTop: '15px' }}>Password Security</div>
                      <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Protect your portal with periodic credential updates.</p>
                  </div>
              </div>
            </div>
          )}

          {activeView === 'history' && (
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800', color: '#1e293b' }}>Pass History</h3>
                <div style={{ background: 'rgba(0,0,0,0.03)', color: theme.muted, padding: '8px 16px', borderRadius: '12px', fontWeight: '800', fontSize: '0.8rem' }}>ENTRIES: {myPasses.length}</div>
              </div>

              {myPasses.length === 0 ? (
                <div style={{ textAlign: 'center', color: theme.muted, padding: '80px 20px', background: 'rgba(0,0,0,0.02)', borderRadius: '24px' }}>No pass records found.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                    <thead>
                      <tr style={{ color: theme.muted, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                        <th style={{ padding: '15px 25px', textAlign: 'left' }}>Reference</th>
                        <th style={{ padding: '15px 25px', textAlign: 'left' }}>Destination</th>
                        <th style={{ padding: '15px 25px', textAlign: 'left' }}>Caretaker</th>
                        <th style={{ padding: '15px 25px', textAlign: 'left' }}>Timings</th>
                        <th style={{ padding: '15px 25px', textAlign: 'right' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myPasses.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map((p, idx) => (
                        <tr key={p._id} className="premium-row" style={{ background: 'rgba(0,0,0,0.01)', borderRadius: '16px' }}>
                          <td style={{ padding: '20px 25px', borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px' }}>
                            <div style={{ fontWeight: '800', color: theme.primary, fontSize: '0.85rem' }}>{p.PassId}</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>{p.passType}</div>
                          </td>
                          <td style={{ padding: '20px 25px' }}>
                            <div style={{ fontWeight: '700', color: '#334155' }}>{p.Place}</div>
                            <div style={{ fontSize: '0.75rem', color: theme.muted }}>{p.Purpose}</div>
                          </td>
                          <td style={{ padding: '20px 25px' }}>
                            <div style={{ fontWeight: '700', color: '#334155' }}>{p.CaretakerId?.Name || "System"}</div>
                            <div style={{ fontSize: '0.75rem', color: theme.muted }}>Block {p.CaretakerId?.HostelBlock || "--"}</div>
                          </td>
                          <td style={{ padding: '20px 25px' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                                Out: {new Date(p.OutDateTime).toLocaleDateString()} {new Date(p.OutDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: p.Status === 'IN' ? theme.success : theme.muted }}>
                                {p.Status === 'IN' ? `In: ${new Date(p.ActualInDateTime).toLocaleTimeString()}` : `Exp: ${new Date(p.ExpectedInDateTime).toLocaleTimeString()}`}
                            </div>
                          </td>
                          <td style={{ padding: '20px 25px', textAlign: 'right', borderTopRightRadius: '16px', borderBottomRightRadius: '16px' }}>
                            <span style={{ 
                              padding: '8px 14px', 
                              background: (p.approved === "YES" || p.Approved === "YES") ? 'rgba(5, 150, 105, 0.05)' : (p.approved === "CANCELL" || p.Approved === "CANCELL") ? 'rgba(249, 115, 22, 0.05)' : 'rgba(0,0,0,0.05)', 
                              color: (p.approved === "YES" || p.Approved === "YES") ? theme.success : (p.approved === "CANCELL" || p.Approved === "CANCELL") ? theme.accent : theme.muted, 
                              borderRadius: '10px', 
                              fontWeight: '900', 
                              fontSize: '0.7rem'
                            }}>
                                {(p.approved === "YES" || p.Approved === "YES") ? "APPROVED" : (p.approved === "CANCELL" || p.Approved === "CANCELL") ? "DENIED" : "PENDING"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeView === 'profile' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
              <div style={cardStyle}>
                <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800', color: '#1e293b', marginBottom: '30px' }}>Student Profile</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                   {[
                     { label: 'Register Number', value: studentProfile.RegisterNumber },
                     { label: 'Roll Number', value: studentProfile.RollNumber },
                     { label: 'Department', value: studentProfile.DepartmentId?.DepartmentName },
                     { label: 'Section', value: studentProfile.Section },
                     { label: 'Current Year', value: calculateYear(studentProfile.StartYear) },
                     { label: 'Gender', value: studentProfile.Gender },
                     { label: 'Housing Block', value: studentProfile.RoomId?.HostelBlock },
                     { label: 'Room Assignment', value: `Room ${studentProfile.RoomId?.RoomNumber}` },
                     { label: 'Guardian Mobile', value: studentProfile.ParentMobileNumber },
                     { label: 'Guardian Email', value: studentProfile.ParentEmail }
                   ].map(item => (
                     <div key={item.label}>
                       <label style={{ fontSize: '0.75rem', color: theme.muted, textTransform: 'uppercase', fontWeight: '800', display: 'block', marginBottom: '5px' }}>{item.label}</label>
                       <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#334155' }}>{item.value || "N/A"}</div>
                     </div>
                   ))}
                </div>
                <div style={{ marginTop: '40px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '30px' }}>
                  <label style={{ fontSize: '0.75rem', color: theme.muted, textTransform: 'uppercase', fontWeight: '800', display: 'block', marginBottom: '10px' }}>Lead Academic Advisor</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: theme.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>AD</div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{studentProfile.AdvisorId?.Name}</div>
                      <div style={{ fontSize: '0.85rem', color: theme.muted }}>Authorized Mentor & Approver</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div style={cardStyle}>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: theme.accent, marginBottom: '25px' }}>Security Settings</h3>
                    <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <input type="password" placeholder="Verify Current Key" className="glass-input" style={inputStyle} value={passwordData.oldPassword} onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})} required />
                      <input type="password" placeholder="Assign New Secret" className="glass-input" style={inputStyle} value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} required />
                      {passwordStatus && (
                        <div style={{ padding: '12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '800', background: passwordStatus.type === "success" ? 'rgba(5, 150, 105, 0.05)' : 'rgba(249, 115, 22, 0.05)', color: passwordStatus.type === "success" ? theme.success : theme.accent, textAlign: 'center' }}>
                            {passwordStatus.text}
                        </div>
                      )}
                      <button type="submit" disabled={isChangingPassword} style={{ ...btnStyle, background: theme.accent }}>Update Secret</button>
                    </form>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* REQUEST MODAL */}
        {showPassModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div style={{ ...cardStyle, background: 'white', width: '550px', maxWidth: '100%', padding: '50px' }}>
              <div style={{ marginBottom: '35px' }}>
                <div style={{ color: theme.primary, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.75rem', marginBottom: '8px' }}>Logistics</div>
                <h3 style={{ margin: 0, fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-1px' }}>Request Pass</h3>
              </div>

              <form onSubmit={handlePassRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <select required style={inputStyle} value={passForm.type} onChange={e => setPassForm({...passForm, type: e.target.value})}>
                        <option value="general">GENERAL PASS</option>
                        <option value="outpass">OUTPASS (HOME)</option>
                        <option value="emergency">EMERGENCY PASS</option>
                    </select>
                    <input type="text" placeholder="Target Destination" required value={passForm.Place} onChange={e => setPassForm({...passForm, Place: e.target.value})} style={inputStyle} />
                </div>

                <input type="text" placeholder="Detailed Purpose of Exit" required value={passForm.Purpose} onChange={e => setPassForm({...passForm, Purpose: e.target.value})} style={inputStyle} />
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ color: theme.muted, fontSize: '0.7rem', marginBottom: '8px', display: 'block', fontWeight: '800', textTransform: 'uppercase' }}>Departure</label>
                    <input type="datetime-local" required value={passForm.OutDateTime} onChange={e => setPassForm({...passForm, OutDateTime: e.target.value})} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ color: theme.muted, fontSize: '0.7rem', marginBottom: '8px', display: 'block', fontWeight: '800', textTransform: 'uppercase' }}>Expected Return</label>
                    <input type="datetime-local" required value={passForm.ExpectedInDateTime} onChange={e => setPassForm({...passForm, ExpectedInDateTime: e.target.value})} style={inputStyle} />
                  </div>
                </div>

                <select 
                  required 
                  style={inputStyle} 
                  value={passForm.CaretakerName || (caretakers.filter(c => c.HostelBlock === studentProfile?.RoomId?.HostelBlock)[0]?.Name || "")} 
                  onChange={e => setPassForm({...passForm, CaretakerName: e.target.value})}
                >
                  <option value="">Approving Caretaker</option>
                  {caretakers
                    .filter(c => c.HostelBlock === studentProfile?.RoomId?.HostelBlock)
                    .map(c => <option key={c._id} value={c.Name}>{c.Name} (Block {c.HostelBlock})</option>)}
                </select>

                <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                  <button type="submit" style={{ ...btnStyle, flex: 2 }}>Confirm Submission</button>
                  <button type="button" onClick={() => setShowPassModal(false)} style={{ flex: 1, padding: '14px', background: 'transparent', color: theme.muted, border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', cursor: 'pointer', fontWeight: '800' }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
