import { useState, useEffect } from "react";
import "./AdminDashboard.css";
import { API } from "../../apiConfig";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);

  // Auto-dismiss MacBook notification toast after 10 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/Admin/complaints`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setComplaints(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleResolve = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/Admin/complaints/${id}/resolve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToast({ message: "Complaint marked as resolved successfully.", type: "success" });
        fetchComplaints();
      } else {
        setToast({ message: data.message || "Failed to resolve complaint.", type: "error" });
      }
    } catch (err) {
      console.error("Error resolving complaint:", err);
      setToast({ message: "An error occurred while resolving complaint.", type: "error" });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = searchTerm === "" || 
      c.Name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.RollOrRegNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.Department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.Status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-card">
      {/* MACBOOK-STYLE SIDE NOTIFICATION TOAST */}
      {toast && (
        <div className="mac-notification-toast">
          <div className="mac-toast-header">
            <span className="mac-toast-app-icon">{toast.type === "success" ? "✅" : "❌"}</span>
            <span className="mac-toast-title">Complaints Tracker</span>
            <span className="mac-toast-time">now</span>
            <button className="mac-toast-close" onClick={() => setToast(null)}>&times;</button>
          </div>
          <div className="mac-toast-body">
            {toast.message}
          </div>
        </div>
      )}

      <style>{`
        .mac-notification-toast {
          position: fixed;
          top: 25px;
          right: 25px;
          width: 320px;
          background: rgba(30, 41, 59, 0.85) !important;
          backdrop-filter: blur(15px) saturate(180%);
          -webkit-backdrop-filter: blur(15px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          border-radius: 14px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          padding: 12px 16px;
          color: white !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          z-index: 10000;
          animation: macSlideIn 0.35s cubic-bezier(0.25, 1, 0.5, 1);
        }

        @keyframes macSlideIn {
          from {
            transform: translateX(125%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .mac-toast-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.65);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .mac-toast-app-icon {
          font-size: 0.95rem;
        }

        .mac-toast-title {
          flex-grow: 1;
        }

        .mac-toast-time {
          color: rgba(255, 255, 255, 0.45);
        }

        .mac-toast-close {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 1.15rem;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          transition: color 0.2s;
        }

        .mac-toast-close:hover {
          color: white;
        }

        .mac-toast-body {
          font-size: 0.85rem;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.95);
          font-weight: 500;
        }
      `}</style>

      <h3>Student Complaints</h3>

      {/* FILTER HUB */}
      <div className="filter-hub" style={{ marginTop: '20px' }}>
        <div className="filter-group search">
          <label className="filter-label">Search Complaints</label>
          <input 
            type="text" 
            className="filter-control" 
            placeholder="Search by Name, Roll/Reg No, or Department..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Status</label>
            <select className="filter-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          {(searchTerm || statusFilter !== "All") && (
            <button className="clear-filters-btn" onClick={clearFilters}>RESET</button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "rgba(255, 255, 255, 0.6)" }}>Loading complaints...</div>
      ) : (
        <div style={{ overflowX: 'auto', marginTop: '15px' }}>
          <table className="premium-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Name</th>
                <th>Roll / Reg No</th>
                <th>Year</th>
                <th>Department</th>
                <th>Room No</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((c) => (
                <tr key={c._id}>
                  <td>
                    <strong>{new Date(c.ComplaintDate).toLocaleDateString()}</strong>
                    <div style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.6)", marginTop: "4px" }}>{c.Time}</div>
                  </td>
                  <td><strong>{c.Name}</strong></td>
                  <td><strong>{c.RollOrRegNo}</strong></td>
                  <td><strong>{c.Year}</strong></td>
                  <td><strong>{c.Department}</strong></td>
                  <td><strong>{c.RoomNo}</strong></td>
                  <td style={{ maxWidth: '250px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {c.Description}
                  </td>
                  <td>
                    <span style={{ 
                      padding: "4px 8px", 
                      borderRadius: "6px", 
                      background: c.Status === "RESOLVED" ? "rgba(16, 185, 129, 0.15)" : "rgba(249, 115, 22, 0.15)", 
                      color: c.Status === "RESOLVED" ? "#10b981" : "#f97316", 
                      fontWeight: "800", 
                      fontSize: "0.75rem",
                      border: c.Status === "RESOLVED" ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(249, 115, 22, 0.3)"
                    }}>
                      {c.Status}
                    </span>
                  </td>
                  <td>
                    {c.Status === "PENDING" ? (
                      <button 
                        className="dash-btn" 
                        style={{ padding: "6px 12px", fontSize: "0.8rem", height: "auto" }} 
                        onClick={() => handleResolve(c._id)}
                      >
                        Mark Resolved
                      </button>
                    ) : (
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", fontWeight: "600" }}>No actions</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredComplaints.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "30px", color: "rgba(255,255,255,0.5)" }}>
                    No complaints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
