import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="sidebar-title">Hostel Admin</div>
        
        <nav className="sidebar-nav">
          <NavLink 
            to="/admin-dashboard" 
            end 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            Home
          </NavLink>
          <NavLink 
            to="/admin-dashboard/rooms" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            Rooms
          </NavLink>
          <NavLink 
            to="/admin-dashboard/departments" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            Departments
          </NavLink>
          <NavLink 
            to="/admin-dashboard/attendance" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            Attendance
          </NavLink>
          <NavLink 
            to="/admin-dashboard/caretakers" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            Caretakers
          </NavLink>
          <NavLink 
            to="/admin-dashboard/advisors" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            Advisors
          </NavLink>
          <NavLink 
            to="/admin-dashboard/placements" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            Placement Batches
          </NavLink>
          <NavLink 
            to="/admin-dashboard/placement-attendance" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            Placement Attendance
          </NavLink>
          <NavLink 
            to="/admin-dashboard/students" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            Students
          </NavLink>
          <NavLink 
            to="/admin-dashboard/passes" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            Pass Management
          </NavLink>
          <NavLink 
            to="/admin-dashboard/accounts" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            Accounts
          </NavLink>
          <NavLink 
            to="/admin-dashboard/profile" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            My Profile
          </NavLink>
          
          <button 
            onClick={handleLogout} 
            className="sidebar-link" 
            style={{ marginTop: "auto", background: "transparent", border: "none", textAlign: "left", width: "100%", color: "#ffb3b0" }}
          >
            Log Out
          </button>
        </nav>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
