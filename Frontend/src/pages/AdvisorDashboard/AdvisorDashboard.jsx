import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { API } from "../../apiConfig";

export default function AdvisorDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchMyStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/Admin/advisors/a/students`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setStudents(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.background = '#0d0f1a';
    document.body.style.minHeight = '100vh';

    // Auth guard — redirect if not logged in as ADVISOR
    const loggedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!loggedUser || loggedUser.Type !== "ADVISOR") {
      navigate("/login");
      return;
    }

    fetchMyStudents();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus({ type: "error", text: "New passwords do not match!" });
      return;
    }
    try {
      setIsChangingPass(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/Admin/users/change-password`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordStatus({ type: "success", text: "Password updated successfully!" });
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setPasswordStatus({ type: "error", text: data.message || "Update failed." });
      }
    } catch (err) {
      setPasswordStatus({ type: "error", text: "Server error." });
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const theme = {
    primary: '#1d4ed8', // Royal Blue
    secondary: '#3b82f6', // Bright Blue
    accent: '#dc2626', // Red for logout
    bg: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
    card: 'rgba(255, 255, 255, 0.7)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    text: '#0f172a',
    muted: '#64748b'
  };

  const containerStyle = { 
    minHeight: '100vh', 
    width: '100%',
    background: theme.bg, 
    color: theme.text, 
    padding: '60px 40px', 
    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
    boxSizing: 'border-box'
  };

  const cardStyle = { 
    background: theme.card, 
    backdropFilter: 'blur(20px)', 
    borderRadius: '32px', 
    padding: '40px', 
    border: theme.border, 
    boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  const inputStyle = { 
    background: 'rgba(255, 255, 255, 0.9)', 
    color: theme.text, 
    border: '1px solid rgba(0, 0, 0, 0.1)', 
    padding: '16px 20px', 
    borderRadius: '18px', 
    width: '100%', 
    boxSizing: 'border-box',
    fontSize: '1rem',
    transition: 'all 0.3s ease'
  };

  const btnStyle = { 
    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`, 
    color: '#fff', 
    border: 'none', 
    borderRadius: '18px', 
    padding: '16px 32px', 
    cursor: 'pointer', 
    fontWeight: '800', 
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    boxShadow: `0 8px 20px rgba(29, 78, 216, 0.25)`,
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
        <p style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '1px', color: theme.primary }}>LOADING DASHBOARD</p>
      </div>
    </div>
  );

  const filteredStudents = students.filter(s => 
    s.Name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.RollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={containerStyle}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; border: 3px solid transparent; background-clip: content-box; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        .premium-row { transition: all 0.3s ease; }
        .premium-row:hover { background: rgba(0, 0, 0, 0.02) !important; transform: translateX(5px); }
        .glass-input:focus { border-color: ${theme.primary}; box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.1); outline: none; }
        
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
          <div>
            <div style={{ color: theme.primary, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.85rem', marginBottom: '12px' }}>Advisor Dashboard</div>
            <h1 style={{ margin: 0, fontSize: '4rem', fontWeight: '800', letterSpacing: '-1.5px', color: '#1e293b' }}>Advisor <span style={{ color: theme.primary }}>Portal</span></h1>
            <p style={{ color: theme.muted, fontSize: '1.1rem', marginTop: '8px' }}>Managing <b>{students.length}</b> Students</p>
          </div>
          <button onClick={handleLogout} style={{ ...btnStyle, background: 'transparent', border: '1.5px solid rgba(220, 38, 38, 0.15)', color: theme.accent, boxShadow: 'none' }}>Logout</button>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '50px' }}>
          
          {/* Main Content Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* SEARCH COMPONENT */}
            <div style={{ ...cardStyle, padding: '25px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#334155' }}>Students List</h3>
                <div style={{ position: 'relative', width: '400px' }}>
                    <input 
                      type="text" 
                      placeholder="Search by name or ID..." 
                      className="glass-input"
                      style={{ ...inputStyle, paddingLeft: '20px' }} 
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* ENHANCED TABLE */}
            <div style={{ ...cardStyle, padding: '10px', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                  <thead>
                    <tr style={{ color: theme.muted, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                      <th style={{ padding: '20px 30px', textAlign: 'left' }}>Profile</th>
                      <th style={{ padding: '20px 30px', textAlign: 'left' }}>Register</th>
                      <th style={{ padding: '20px 30px', textAlign: 'left' }}>Department</th>
                      <th style={{ padding: '20px 30px', textAlign: 'left' }}>Location</th>
                      <th style={{ padding: '20px 30px', textAlign: 'right' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((s, idx) => (
                      <tr key={s._id} className="premium-row" style={{ background: 'rgba(0,0,0,0.01)', borderRadius: '16px', animation: `slideIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${idx * 0.05}s both` }}>
                        <td style={{ padding: '25px 30px', borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px' }}>
                          <div style={{ fontWeight: '700', fontSize: '1.15rem', color: '#1e293b' }}>{s.Name}</div>
                          <div style={{ fontSize: '0.85rem', color: theme.muted }}>Roll: {s.RollNumber}</div>
                        </td>
                        <td style={{ padding: '25px 30px' }}>
                            <div style={{ color: theme.primary, padding: '4px 0', fontWeight: '800', fontSize: '0.9rem' }}>{s.RegisterNumber}</div>
                        </td>
                        <td style={{ padding: '25px 30px' }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#475569' }}>{s.DepartmentId?.DepartmentName}</div>
                            <div style={{ fontSize: '0.8rem', color: theme.muted }}>Sec {s.Section}</div>
                        </td>
                        <td style={{ padding: '25px 30px' }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#475569' }}>Room {s.RoomId?.RoomNumber}</div>
                            <div style={{ fontSize: '0.8rem', color: theme.muted }}>Block {s.RoomId?.HostelBlock}</div>
                        </td>
                        <td style={{ padding: '25px 30px', textAlign: 'right', borderTopRightRadius: '16px', borderBottomRightRadius: '16px' }}>
                          <span style={{ 
                            padding: '8px 16px', 
                            borderRadius: '10px', 
                            fontSize: '0.75rem', 
                            fontWeight: '800',
                            textTransform: 'uppercase',
                            background: s.Status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: s.Status === 'ACTIVE' ? '#059669' : '#dc2626',
                            border: `1px solid ${s.Status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}`
                          }}>
                            {s.Status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* STAT CARDS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ ...cardStyle, background: 'white', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '0.85rem', color: theme.muted, textTransform: 'uppercase', fontWeight: '700' }}>Total Students</div>
                    <div style={{ fontSize: '3.5rem', fontWeight: '800', color: theme.primary, lineHeight: 1 }}>{students.length}</div>
                </div>
                <div style={{ ...cardStyle, background: 'white', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '0.85rem', color: theme.muted, textTransform: 'uppercase', fontWeight: '700' }}>Active Students</div>
                    <div style={{ fontSize: '3.5rem', fontWeight: '800', color: '#059669', lineHeight: 1 }}>{students.filter(s => s.Status === 'ACTIVE').length}</div>
                </div>
            </div>

            {/* SECURITY BOX */}
            <div style={cardStyle}>
              <h3 style={{ margin: 0, marginBottom: '30px', fontSize: '1.4rem', fontWeight: '800', color: '#334155' }}>Security Settings</h3>
              <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <input type="password" placeholder="Verify Current Key" required className="glass-input" style={inputStyle} value={passwordData.oldPassword} onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} />
                <input type="password" placeholder="Assign New Key" required className="glass-input" style={inputStyle} value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} />
                <input type="password" placeholder="Confirm New Key" required className="glass-input" style={inputStyle} value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} />
                
                {passwordStatus && (
                  <div style={{ padding: '15px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: '700', background: passwordStatus.type==='success'?'rgba(16, 185, 129, 0.05)':'rgba(239, 68, 68, 0.05)', color: passwordStatus.type==='success'?'#059669':'#dc2626', textAlign: 'center' }}>
                    {passwordStatus.text}
                  </div>
                )}

                <button type="submit" disabled={isChangingPass} style={btnStyle}>
                  {isChangingPass ? "Verifying..." : "Update Security"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
      <style>{`
        @keyframes slideIn { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
      `}</style>
    </div>
  );
}
