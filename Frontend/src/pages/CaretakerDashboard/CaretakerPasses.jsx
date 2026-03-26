import { useState, useEffect } from "react";
import { getCaretakerPasses, approvePass, cancelPass, markEntry } from "../../api/caretaker";
import "./CaretakerDashboard.css";

export default function CaretakerPasses() {
  const [passData, setPassData] = useState({ outPasses: [], generalPasses: [], emergencyPasses: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchPasses = async () => {
    try {
      setLoading(true);
      const res = await getCaretakerPasses(user._id);
      if (res.success) {
        setPassData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasses();
  }, [user._id]);

  const handleAction = async (id, type, action) => {
     try {
        let res;
        if (action === "APPROVE") res = await approvePass(id, type);
        else if (action === "CANCEL") res = await cancelPass(id, type);
        else if (action === "RETURN") res = await markEntry(id, type);

        if (res && res.message) {
           alert(res.message + (res.late ? " (LATE ENTRY RECORDED)" : ""));
           fetchPasses();
        }
     } catch (err) {
        alert("Action failed");
     }
  };

  if (loading) return <div className="glass-card">Loading Passes...</div>;
  if (!passData) return <div className="glass-card">Error loading pass data.</div>;

  const renderPassTable = (title, passList, type) => (
    <div className="glass-card" style={{ padding: '0', overflow: 'hidden', marginBottom: '40px' }}>
      <h3 style={{ padding: '25px 30px', margin: 0, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{title}</h3>
      <table className="ct-table">
        <thead>
          <tr>
            <th>Pass ID</th>
            <th>Student Info</th>
            <th>Type/Purpose</th>
            <th>Schedule</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {passList
            .filter(p => {
               const matchesSearch = searchTerm === "" || 
                  (p.StudentId?.Name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (p.StudentId?.RegisterNumber || "").includes(searchTerm);
               const currentStatus = (p.Approved === "YES" || p.approved === "YES") ? "APPROVED" : (p.Approved === "CANCELL" || p.approved === "CANCELL") ? "CANCELLED" : "PENDING";
               const matchesStatus = statusFilter === "All" || currentStatus === statusFilter;
               return matchesSearch && matchesStatus;
            })
            .map((p) => (
              <tr key={p._id}>
                <td style={{ fontWeight: 'bold', color: '#60a5fa' }}>{p.PassId}</td>
                <td>
                  <div style={{ fontWeight: '700' }}>{p.StudentId?.Name || "Student"}</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{p.StudentId?.RegisterNumber}</div>
                </td>
                <td>
                    <div style={{ fontWeight: '600', color: '#6ee7b7' }}>{type === 1 ? "OUT PASS" : type === 2 ? "GENERAL" : "EMERGENCY"}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{p.Purpose}</div>
                </td>
                <td>
                    <div>O: {p.OutDateTime ? new Date(p.OutDateTime).toLocaleDateString() : "N/A"}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>E.In: {p.ExpInDateTime ? new Date(p.ExpInDateTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : "N/A"}</div>
                </td>
                <td>
                  <span className={`badge ${(p.Approved === "YES" || p.approved === "YES") ? "badge-approved" : (p.Approved === "CANCELL" || p.approved === "CANCELL") ? "badge-cancelled" : "badge-pending"}`}>
                    {(p.Approved === "YES" || p.approved === "YES") ? "APPROVED" : (p.Approved === "CANCELL" || p.approved === "CANCELL") ? "CANCELLED" : "PENDING"}
                  </span>
                </td>
                <td>
                  {!(p.Approved === "YES" || p.approved === "YES" || p.Approved === "CANCELL" || p.approved === "CANCELL") && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleAction(p._id, type, "APPROVE")} className="action-btn btn-approve">Grant</button>
                      <button onClick={() => handleAction(p._id, type, "CANCEL")} className="action-btn btn-cancel">Deny</button>
                    </div>
                  )}
                  {(p.Approved === "YES" || p.approved === "YES") && p.Status === "OUT" && (
                    <button onClick={() => handleAction(p._id, type, "RETURN")} className="action-btn btn-approve" style={{ background: '#ffa500', width: '100%' }}>Mark In</button>
                  )}
                  {p.Status === "IN" && (p.Approved === "YES" || p.approved === "YES") && <span style={{ color: '#6ee7b7', fontSize: '0.85rem', fontWeight: 'bold' }}>Returned</span>}
                </td>
              </tr>
            ))
          }
          {passList.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: '20px' }}>No {title.toLowerCase()} recorded.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="caretaker-passes">
       <h2>Pass Management - Block {user.HostelBlock}</h2>

       <div className="filter-hub">
          <div className="filter-group search">
              <label className="filter-label">Search Student</label>
              <input 
                  className="filter-control" 
                  placeholder="Name or Registration Number..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>

          <div className="filter-row">
              <div className="filter-group">
                  <label className="filter-label">Approval Status</label>
                  <select className="filter-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                      <option value="All">All Requests</option>
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="CANCELLED">Cancelled</option>
                  </select>
              </div>

              {(searchTerm || statusFilter !== "All") && (
                  <button className="clear-filters-btn" onClick={() => { setSearchTerm(""); setStatusFilter("All"); }}>RESET</button>
              )}
          </div>
       </div>

       {renderPassTable("Out Passes", passData.outPasses, 1)}
       {renderPassTable("General Passes", passData.generalPasses, 2)}
       {renderPassTable("Emergency Passes", passData.emergencyPasses, 3)}
    </div>
  );
}
