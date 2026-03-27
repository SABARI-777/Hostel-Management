import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../apiConfig";

export default function AdvisorProfile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setStatus({ type: "error", text: "New passwords do not match!" });
      return;
    }
    
    try {
      setLoading(true);
      const res = await fetch(`${API}/Admin/users/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          oldPassword: passwordData.oldPassword, 
          newPassword: passwordData.newPassword 
        })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "success", text: "Password updated successfully!" });
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setStatus({ type: "error", text: data.message || "Update failed." });
      }
    } catch (err) {
      setStatus({ type: "error", text: "Server error." });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const containerStyle = { 
    minHeight: '100vh', 
    background: 'linear-gradient(135deg, #0d0f1a 0%, #1a1f33 100%)', 
    color: 'white', 
    padding: '40px',
    fontFamily: 'system-ui, sans-serif'
  };

  const glassStyle = {
    background: 'rgba(30, 40, 60, 0.4)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
  };

  const inputStyle = { 
    background: 'rgba(255,255,255,0.05)', 
    color: 'white', 
    border: '1px solid rgba(255,255,255,0.1)', 
    padding: '14px', 
    borderRadius: '12px', 
    width: '100%', 
    boxSizing: 'border-box' 
  };

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2.5rem' }}>Advisor Profile</h1>
            <p style={{ opacity: 0.6 }}>Academic Counselor & Staff Portal</p>
          </div>
          <button onClick={handleLogout} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #ef4444', color: '#ef4444', background: 'transparent', cursor: 'pointer' }}>Log Out</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Details */}
          <div style={glassStyle}>
            <h3 style={{ color: '#818cf8', marginTop: 0 }}>Account Details</h3>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', opacity: 0.5 }}>EMAIL ADDRESS</label>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{user.Email}</div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', opacity: 0.5 }}>ROLE</label>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#818cf8' }}>{user.Type}</div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div style={glassStyle}>
            <h3 style={{ color: '#f87171', marginTop: 0 }}>Security Settings</h3>
            <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="password" placeholder="Current Password" style={inputStyle} value={passwordData.oldPassword} onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} required />
              <input type="password" placeholder="New Password" style={inputStyle} value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} required />
              <input type="password" placeholder="Confirm New Password" style={inputStyle} value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} required />
              
              {status && (
                <div style={{ padding: '10px', borderRadius: '8px', fontSize: '0.8rem', background: status.type==='success'?'rgba(16,185,129,0.1)':'rgba(248,113,113,0.1)', color: status.type==='success'?'#10b981':'#f87171' }}>
                  {status.text}
                </div>
              )}
              
              <button type="submit" disabled={loading} style={{ padding: '14px', borderRadius: '12px', border: 'none', background: '#f87171', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                {loading ? "Updating..." : "Change Security Key"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
