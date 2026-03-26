import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { getCaretakerDetails } from "../../api/caretaker";
import "./CaretakerDashboard.css";

export default function CaretakerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [status, setStatus] = useState(user.Status || "ACTIVE");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await getCaretakerDetails(user._id);
        if (res.data) {
          const newStatus = res.data.Status;
          setStatus(newStatus);
          // Sync with localStorage if changed
          if (newStatus !== user.Status) {
            localStorage.setItem("user", JSON.stringify({ ...user, Status: newStatus }));
          }

          // REDIRECT IF INACTIVE
          if (newStatus === "INACTIVE" && location.pathname !== "/caretaker-dashboard/profile") {
            alert("Your account is currently INACTIVE. Redirecting to Profile page.");
            navigate("/caretaker-dashboard/profile");
          }
        }
      } catch (err) { console.error("Status check failed", err); }
    };
    if (user._id) checkStatus();
  }, [user._id]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Logged out successfully");
    navigate("/login");
  };

  const isInactive = status !== "ACTIVE";

  return (
    <div className="caretaker-container">
      <aside className="caretaker-sidebar">
        <div className="sidebar-brand">
          <h2>Hostel Care</h2>
          <p>Caretaker Portal</p>
        </div>
        
        <nav className="caretaker-nav">
          <NavLink 
            to="/caretaker-dashboard" 
            end 
            className={({ isActive }) => isActive ? "caretaker-link active" : "caretaker-link"}
          >
            <span>Overview</span>
          </NavLink>
          
          {!isInactive && (
            <>
              <NavLink 
                to="/caretaker-dashboard/students" 
                className={({ isActive }) => isActive ? "caretaker-link active" : "caretaker-link"}
              >
                <span>Students</span>
              </NavLink>
              
              <NavLink 
                to="/caretaker-dashboard/passes" 
                className={({ isActive }) => isActive ? "caretaker-link active" : "caretaker-link"}
              >
                                <span>Passes</span>
              </NavLink>

              <NavLink 
                to="/caretaker-dashboard/attendance" 
                className={({ isActive }) => isActive ? "caretaker-link active" : "caretaker-link"}
              >
                <span>Attendance</span>
              </NavLink>

              <NavLink 
                to="/caretaker-dashboard/placement-attendance" 
                className={({ isActive }) => isActive ? "caretaker-link active" : "caretaker-link"}
              >
                <span>Training</span>
              </NavLink>
            </>
          )}

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', margin: '15px 0' }} />

          <NavLink 
            to="/caretaker-dashboard/profile" 
            className={({ isActive }) => isActive ? "caretaker-link active" : "caretaker-link"}
          >
            <span>My Profile</span>
          </NavLink>
          <button 
            onClick={handleLogout} 
            className="caretaker-link" 
            style={{ marginTop: "auto", background: "transparent", border: "none", textAlign: "left", width: "100%", color: "#f87171" }}
          >
            <span>Log Out</span>
          </button>
        </nav>
      </aside>

      <main className="caretaker-content">
        <div className="animate-up">
           <header style={{ marginBottom: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1.5px' }}>Welcome!</h1>
                {isInactive ? (
                  <p style={{ color: '#f87171', margin: '8px 0 0', fontWeight: '700', fontSize: '1.1rem' }}>Account Restricted</p>
                ) : (
                  <p style={{ color: 'rgba(255,255,255,0.4)', margin: '8px 0 0', fontSize: '1.1rem' }}>
                    <span style={{ color: '#818cf8', fontWeight: '700' }}>Block {user.HostelBlock || "A"}</span> Overview
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                 <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{user.Name || "Caretaker"}</div>
                    <div style={{ fontSize: '0.85rem', color: isInactive ? '#ef4444' : '#818cf8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {isInactive ? "Inactive Session" : "Active Session"}
                    </div>
                 </div>
                 <div style={{ 
                   width: '52px', 
                   height: '52px', 
                   borderRadius: '18px', 
                   background: isInactive ? 'rgba(239, 68, 68, 0.1)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
                   display: 'flex', 
                   alignItems: 'center', 
                   justifyContent: 'center', 
                   color: '#fff', 
                   fontWeight: '800', 
                   fontSize: '1.4rem',
                   border: isInactive ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.2)',
                   boxShadow: isInactive ? 'none' : '0 10px 20px rgba(99, 102, 241, 0.3)'
                 }}>
                    {(user.Name || "C")[0]}
                 </div>
              </div>
           </header>
           <Outlet />
        </div>
      </main>
    </div>
  );
}
