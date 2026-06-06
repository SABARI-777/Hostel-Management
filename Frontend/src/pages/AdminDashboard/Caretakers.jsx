import { useState, useEffect } from "react";
import "./AdminDashboard.css";

import { API } from "../../apiConfig";

export default function Caretakers() {
  const [caretakers, setCaretakers] = useState([]);
  const [form, setForm] = useState({
    Name: "",
    Email: "",
    Status: "ACTIVE",
    HostelBlock: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchCaretakers = async () => {
    try {
      const res = await fetch(`${API}/Admin/caretakers/ct/details/`);
      const data = await res.json();
      if (data.data) setCaretakers(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCaretakers();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = editId ? `${API}/Admin/caretakers/ct/update/` : `${API}/Admin/caretakers/ct/add/`;
    const method = editId ? "PATCH" : "POST";
    const body = editId ? { ...form, _id: editId } : form;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.status === 201 || res.status === 200) {
        alert(`Caretaker ${editId ? "updated" : "assigned"} successfully!`);
        setForm({ Name: "", Email: "", Status: "ACTIVE", HostelBlock: "" });
        setEditId(null);
        fetchCaretakers();
      } else {
        alert(data.message || "Operation failed");
      }
    } catch (err) {
      alert("Error processing request");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ct) => {
    setForm({
      Name: ct.Name,
      Email: ct.UserID?.Email || "Cannot Update Email",
      Status: ct.Status,
      HostelBlock: ct.HostelBlock,
    });
    setEditId(ct._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this Caretaker?")) return;
    try {
      const res = await fetch(`${API}/Admin/caretakers/ct/delete/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      if (res.status === 200) {
        alert("Caretaker deleted successfully");
        fetchCaretakers();
      } else {
        const data = await res.json();
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      alert("Error deleting caretaker");
    }
  };

  const handleCancelEdit = () => {
    setForm({ Name: "", Email: "", Status: "ACTIVE", HostelBlock: "" });
    setEditId(null);
  };

  const filteredCaretakers = caretakers.filter(ct => 
    searchTerm === "" || 
    (ct.Name && ct.Name.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (ct.UserID?.Email && ct.UserID.Email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (ct.HostelBlock && ct.HostelBlock.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredCaretakers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCaretakers = filteredCaretakers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="dashboard-card">
      <h3>Manage Caretakers</h3>
      
      <form onSubmit={handleSubmit} className="dashboard-form">
        <div className="form-group">
          <label>Full Name</label>
          <input className="dash-input" name="Name" value={form.Name} onChange={handleChange} required />
        </div>
        {!editId && (
           <div className="form-group">
            <label>User Login Email</label>
            <input className="dash-input" type="email" name="Email" value={form.Email} onChange={handleChange} required />
          </div>
        )}
        <div className="form-group">
          <label>Hostel Block Assignment</label>
          <input className="dash-input" name="HostelBlock" value={form.HostelBlock} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select className="dash-input" name="Status" value={form.Status} onChange={handleChange} required>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        <div className="form-group" style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <button type="submit" className="dash-btn" disabled={loading}>
            {loading ? "Saving..." : editId ? "Update Caretaker" : "Assign Caretaker"}
          </button>
          {editId && (
            <button type="button" className="dash-btn danger" style={{ marginLeft: "10px" }} onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* SEARCH BAR */}
      <div className="filter-hub" style={{ marginTop: '30px' }}>
          <div className="filter-group search">
              <label className="filter-label">Search Caretakers</label>
              <input 
                type="text" 
                className="filter-control" 
                placeholder="Search by Name, Email, or Block (e.g. John Doe, A-Block)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
          {searchTerm && (
            <div className="filter-row">
              <button className="clear-filters-btn" onClick={() => setSearchTerm("")}>RESET</button>
            </div>
          )}
      </div>

      <table className="premium-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>User Account Email</th>
            <th>Assigned Block</th>
            <th>Active Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCaretakers && paginatedCaretakers.length > 0 ? (
            paginatedCaretakers.map((ct) => (
            <tr key={ct._id}>
              <td><strong>{ct.Name}</strong></td>
              <td>{ct.UserID?.Email || "Unmapped"}</td>
              <td><strong>{ct.HostelBlock || "N/A"}</strong></td>
              <td>
                <span style={{
                  padding: "4px 8px", 
                  borderRadius: "4px",
                  background: (ct.Status && ct.Status.trim().toUpperCase() === "ACTIVE") ? "rgba(40, 167, 69, 0.2)" : "rgba(220, 53, 69, 0.2)",
                  color: (ct.Status && ct.Status.trim().toUpperCase() === "ACTIVE") ? "#28a745" : "#dc3545"
                }}>
                  {ct.Status}
                </span>
              </td>
              <td>
                <button className="dash-btn" style={{ padding: "6px 12px", fontSize: "0.8rem", height: "auto", marginRight: "8px" }} onClick={() => handleEdit(ct)}>Edit</button>
                <button className="dash-btn danger" style={{ padding: "6px 12px", fontSize: "0.8rem", height: "auto" }} onClick={() => handleDelete(ct._id)}>Delete</button>
              </td>
            </tr>
          ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "rgba(255,255,255,0.5)" }}>No Caretakers found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="pagination-bar" style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '20px', alignItems: 'center' }}>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)} className="dash-btn" style={{ padding: '6px 12px', height: 'auto' }}>&laquo;</button>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="dash-btn" style={{ padding: '6px 12px', height: 'auto' }}>&lsaquo;</button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum = currentPage - 2 + i;
            if (currentPage <= 2) pageNum = i + 1;
            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
            if (pageNum < 1 || pageNum > totalPages) return null;
            return (
              <button 
                key={pageNum} 
                onClick={() => setCurrentPage(pageNum)} 
                className={`dash-btn ${currentPage === pageNum ? 'active' : ''}`}
                style={{ padding: '6px 12px', height: 'auto', background: currentPage === pageNum ? '#007bff' : 'rgba(255,255,255,0.1)' }}
              >
                {pageNum}
              </button>
            );
          })}
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="dash-btn" style={{ padding: '6px 12px', height: 'auto' }}>&rsaquo;</button>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} className="dash-btn" style={{ padding: '6px 12px', height: 'auto' }}>&raquo;</button>
          <span style={{ color: 'white', marginLeft: '10px', fontSize: '0.9rem' }}>Page {currentPage} of {totalPages}</span>
        </div>
      )}
    </div>
  );
}
