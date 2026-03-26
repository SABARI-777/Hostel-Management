import { useState, useEffect } from "react";
import { getCaretakerDetails, updateCaretakerProfile } from "../../api/caretaker";
import "./CaretakerDashboard.css";

export default function CaretakerProfile() {
  const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [caretaker, setCaretaker] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    _id: loggedUser._id,
    Name: "",
    Email: "",
    Password: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordStatus, setPasswordStatus] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getCaretakerDetails(loggedUser._id);
      if (res.data) {
        setCaretaker(res.data);
        setFormData({
            _id: loggedUser._id,
            Name: res.data.Name,
            Email: res.data.UserID?.Email || "",
            Password: ""
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await updateCaretakerProfile(formData);
      if (res.success) {
        setMessage({ type: "success", text: "Profile Updated Successfully!" });
        setTimeout(() => {
            setIsEditing(false);
            setMessage(null);
            fetchProfile();
        }, 1500);
      } else {
        setMessage({ type: "error", text: res.message || "Update failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Server Error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus({ type: "error", text: "New passwords do not match!" });
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch("http://localhost:3000/Admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          oldPassword: passwordData.oldPassword, 
          newPassword: passwordData.newPassword 
        })
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordStatus({ type: "success", text: "Password changed successfully!" });
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setPasswordStatus({ type: "error", text: data.message || "Failed to change password." });
      }
    } catch (err) {
      setPasswordStatus({ type: "error", text: "Server error occurred." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '100px', fontSize: '1.2rem' }}>Loading Profile Data...</div>;

  const inputStyle = { background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', borderRadius: '12px', width: '100%', boxSizing: 'border-box' };

  // --- MODE 1: REFINED VIEW MODE ---
  if (!isEditing) {
    return (
        <div className="caretaker-profile-view animate-up" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
                <div>
                   <h2 style={{ margin: 0, fontSize: '3.2rem', fontWeight: '900', letterSpacing: '-1px' }}>{caretaker?.Name}</h2>
                   <p style={{ margin: '10px 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '1.3rem' }}>Administrator - Hostel Block {caretaker?.HostelBlock}</p>
                </div>
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="action-btn btn-approve"
                  style={{ padding: '20px 40px', fontSize: '1.1rem', fontWeight: '700', borderRadius: '15px' }}
                >
                  Manage Profile
                </button>
            </div>

            <div className="glass-card" style={{ padding: '50px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginTop: 0, fontSize: '1.8rem', color: '#10b981' }}>Caretaker Credentials</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '50px', marginTop: '40px' }}>
                    <div>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>Full Identity Name</span>
                        <div style={{ fontSize: '1.8rem', fontWeight: '700', marginTop: '10px' }}>{caretaker?.Name}</div>
                    </div>
                    <div>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>Assigned Jurisdiction</span>
                        <div style={{ fontSize: '1.8rem', fontWeight: '700', marginTop: '10px', color: '#10b981' }}>Block {caretaker?.HostelBlock}</div>
                    </div>
                    <div>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>System Identification</span>
                        <div style={{ fontSize: '1.8rem', fontWeight: '700', marginTop: '10px' }}>{caretaker?.UserID?.Email}</div>
                    </div>
                    <div>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>Account Authority</span>
                        <div style={{ fontSize: '1.8rem', fontWeight: '700', marginTop: '10px', color: '#3b82f6' }}>Caretaker</div>
                    </div>
                    <div>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>Current Status</span>
                        <div style={{ 
                            display: 'inline-block', 
                            marginTop: '15px', 
                            background: caretaker?.Status === "ACTIVE" ? 'rgba(16, 185, 129, 0.1)' : 'rgba(248, 113, 113, 0.1)', 
                            color: caretaker?.Status === "ACTIVE" ? '#10b981' : '#f87171', 
                            padding: '10px 25px', 
                            borderRadius: '12px', 
                            fontWeight: '900', 
                            fontSize: '1rem', 
                            border: `1px solid ${caretaker?.Status === "ACTIVE" ? 'rgba(16, 185, 129, 0.2)' : 'rgba(248, 113, 113, 0.2)'}` 
                        }}>
                             {caretaker?.Status || "ACTIVE"}
                        </div>
                    </div>
                </div>
            </div>

            {/* SECURITY SETTINGS CARD */}
            <div className="glass-card" style={{ padding: '50px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', marginTop: '40px' }}>
                <h3 style={{ borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginTop: 0, fontSize: '1.8rem', color: '#f87171' }}>Security Settings</h3>
                <form onSubmit={handlePasswordChange} style={{ marginTop: '40px', maxWidth: '500px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Current Password</label>
                            <input 
                                type="password" 
                                style={{ ...inputStyle, background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} 
                                value={passwordData.oldPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '10px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>New Password</label>
                                <input 
                                    type="password" 
                                    style={{ ...inputStyle, background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} 
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '10px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Confirm New Password</label>
                                <input 
                                    type="password" 
                                    style={{ ...inputStyle, background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} 
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        {passwordStatus && (
                            <div style={{ 
                                padding: '15px', 
                                borderRadius: '10px', 
                                background: passwordStatus.type === "success" ? 'rgba(16, 185, 129, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                                color: passwordStatus.type === "success" ? '#10b981' : '#f87171',
                                border: `1px solid ${passwordStatus.type === "success" ? '#10b981' : '#f87171'}`,
                                fontSize: '0.9rem',
                                fontWeight: 'bold'
                            }}>
                                {passwordStatus.text}
                            </div>
                        )}
                        <button 
                            type="submit" 
                            disabled={submitting} 
                            style={{ 
                                padding: '15px 30px', 
                                background: '#f87171', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '12px', 
                                fontWeight: 'bold', 
                                cursor: 'pointer',
                                marginTop: '10px'
                            }}
                        >
                            {submitting ? "Updating Authorization..." : "Confirm Password Change"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
  }

  // --- MODE 2: REFINED EDIT MODE ---
  return (
    <div className="caretaker-profile-edit animate-up" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '80vh',
        padding: '20px'
    }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ margin: 0, fontSize: '32px', fontWeight: '900', color: '#fff' }}>Edit Identity Information</h2>
            <p style={{ margin: '10px 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '18px' }}>Update security credentials for Block {caretaker?.HostelBlock}</p>
        </div>

        <div style={{ 
            background: '#ffffff', 
            borderRadius: '40px', 
            padding: '50px', 
            width: '100%', 
            maxWidth: '500px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
            color: '#111827'
        }}>
            
            <div style={{ marginBottom: '40px' }}>
                <div style={{ 
                    background: caretaker?.Status === "ACTIVE" ? '#f9fafb' : 'rgba(248, 113, 113, 0.1)', 
                    padding: '20px', 
                    borderRadius: '20px', 
                    textAlign: 'center', 
                    border: `1px solid ${caretaker?.Status === "ACTIVE" ? '#e5e7eb' : 'rgba(248, 113, 113, 0.2)'}`, 
                    color: caretaker?.Status === "ACTIVE" ? '#10b981' : '#f87171', 
                    fontSize: '18px', 
                    fontWeight: '800' 
                }}>
                   {caretaker?.Status === "ACTIVE" ? `Block ${caretaker?.HostelBlock} Administrator` : "ACCOUNT CURRENTLY INACTIVE"}
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ fontSize: '15px', fontWeight: '800', color: '#374151', marginLeft: '5px' }}>Full Caretaker Name</label>
                    <input 
                        name="Name"
                        value={formData.Name}
                        onChange={handleChange}
                        placeholder="Legal Name"
                        style={{ padding: '20px 25px', borderRadius: '18px', border: '1px solid #d1d5db', fontSize: '17px', background: '#f9fafb', outline: 'none', color: '#111827', fontWeight: '600' }}
                        required
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ fontSize: '15px', fontWeight: '800', color: '#374151', marginLeft: '5px' }}>Account Email</label>
                    <input 
                        name="Email"
                        type="email"
                        value={formData.Email}
                        onChange={handleChange}
                        placeholder="email@hostel.edu"
                        style={{ padding: '20px 25px', borderRadius: '18px', border: '1px solid #d1d5db', fontSize: '17px', background: '#f9fafb', outline: 'none', color: '#111827', fontWeight: '600' }}
                        required
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ fontSize: '15px', fontWeight: '800', color: '#374151', marginLeft: '5px' }}>Security Password</label>
                    <input 
                        name="Password"
                        type="password"
                        value={formData.Password}
                        onChange={handleChange}
                        placeholder="New or current password"
                        style={{ padding: '20px 25px', borderRadius: '18px', border: '1px solid #d1d5db', fontSize: '17px', background: '#f9fafb', outline: 'none', color: '#111827', fontWeight: '600' }}
                        required
                    />
                </div>

                {message && (
                    <div style={{ 
                        padding: '18px', 
                        borderRadius: '20px', 
                        fontSize: '16px', 
                        textAlign: 'center',
                        background: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
                        color: message.type === 'success' ? '#065f46' : '#991b1b',
                        fontWeight: '800',
                        border: `2px solid ${message.type === 'success' ? '#10b981' : '#f87171'}`
                    }}>
                        {message.text}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                    <button 
                        type="submit" 
                        disabled={submitting}
                        style={{ flex: 2, background: '#10b981', color: 'white', border: 'none', borderRadius: '20px', padding: '22px', fontSize: '18px', fontWeight: '900', cursor: 'pointer', transition: 'transform 0.2s' }}
                    >
                        {submitting ? "Updating..." : "Save Changes"}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setIsEditing(false)}
                        style={{ flex: 1, background: '#f3f4f6', color: '#4b5563', border: '1px solid #d1d5db', borderRadius: '20px', padding: '22px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>

        <div style={{ marginTop: '40px', color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontWeight: '600', letterSpacing: '1px' }}>
           HOSTEL BLOCK {caretaker?.HostelBlock} - SECURE SESSION
        </div>
    </div>
  );
}
