import { useState, useEffect } from "react";
import "./AdminDashboard.css";
import { API } from "../../apiConfig";

export default function AdminProfile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const inputStyle = { background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', borderRadius: '12px', width: '100%', boxSizing: 'border-box' };

  return (
    <div className="admin-profile animate-up" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '50px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>System Administrator</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '10px' }}>Root Access - Hostel Management System</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* ACCOUNT INFO */}
        <div className="glass-card" style={{ padding: '40px', borderRadius: '24px' }}>
          <h3 style={{ color: '#60a5fa', marginBottom: '30px' }}>Account Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px' }}>Login Email</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '5px' }}>{user.Email}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px' }}>Account Type</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '5px', color: '#60a5fa' }}>SUPER ADMIN</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px' }}>Permissions</span>
                <div style={{ fontSize: '1rem', fontWeight: '600', marginTop: '5px', opacity: 0.8 }}>Full System Write Access</div>
              </div>
          </div>
        </div>

        {/* SECURITY SETTINGS */}
        <div className="glass-card" style={{ padding: '40px', borderRadius: '24px' }}>
          <h3 style={{ color: '#f87171', marginBottom: '30px' }}>Security & Password</h3>
          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input 
              type="password" 
              placeholder="Old Password" 
              style={inputStyle}
              value={passwordData.oldPassword}
              onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
              required
            />
            <input 
              type="password" 
              placeholder="New Password" 
              style={inputStyle}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              required
            />
            <input 
              type="password" 
              placeholder="Confirm New Password" 
              style={inputStyle}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              required
            />

            {status && (
              <div style={{ 
                padding: '12px', 
                borderRadius: '10px', 
                fontSize: '0.85rem',
                background: status.type === "success" ? 'rgba(16, 185, 129, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                color: status.type === "success" ? '#10b981' : '#f87171',
                border: `1px solid ${status.type === "success" ? '#10b981' : '#f87171'}`
              }}>
                {status.text}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              style={{ padding: '15px', background: '#f87171', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {loading ? "Updating..." : "Update Root Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
