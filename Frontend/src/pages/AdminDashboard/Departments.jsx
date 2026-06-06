import { useState, useEffect } from "react";
import "./AdminDashboard.css";

import { API } from "../../apiConfig";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ DepartmentName: "", HodName: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/Admin/stats/overview`);
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (err) { console.error(err); }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${API}/Admin/departments/d/details`);
      const data = await res.json();
      if (data.data) setDepartments(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchStats();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = editId ? `${API}/Admin/departments/d/update` : `${API}/Admin/departments/d/add`;
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
        alert(`Department ${editId ? "updated" : "added"} successfully!`);
        setForm({ DepartmentName: "", HodName: "" });
        setEditId(null);
        fetchDepartments();
      } else {
        alert(data.message || "Failed operation");
      }
    } catch (err) {
      alert("Error modifying department");
    } finally {
      setLoading(false);
      fetchStats();
    }
  };

  const handleEdit = (dept) => {
    setForm({
      DepartmentName: dept.DepartmentName,
      HodName: dept.HodName,
    });
    setEditId(dept._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      const res = await fetch(`${API}/Admin/departments/d/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      if (res.status === 200) {
        alert("Department deleted successfully");
        fetchDepartments();
      } else {
        const data = await res.json();
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      alert("Error deleting department");
    }
  };

  const handleCancelEdit = () => {
    setForm({ DepartmentName: "", HodName: "" });
    setEditId(null);
  };

  const filteredDepartments = departments.filter(dept => 
    searchTerm === "" || 
    (dept.DepartmentName && dept.DepartmentName.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (dept.HodName && dept.HodName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDepartments = filteredDepartments.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="dashboard-card">
      <h3>Manage Departments</h3>
      
      <form onSubmit={handleSubmit} className="dashboard-form">
        <div className="form-group">
          <label>Department Name</label>
          <input className="dash-input" name="DepartmentName" value={form.DepartmentName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>HOD Name</label>
          <input className="dash-input" name="HodName" value={form.HodName} onChange={handleChange} required />
        </div>
        <div className="form-group" style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <button type="submit" className="dash-btn" disabled={loading}>
            {loading ? "Saving..." : editId ? "Update Dept" : "Add Dept"}
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
              <label className="filter-label">Search Departments</label>
              <input 
                type="text" 
                className="filter-control" 
                placeholder="Search by Department Name or HOD (e.g. CSE, Dr. Smith)..." 
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
            <th>Department Name</th>
            <th>HOD</th>
            <th>Year-wise Distribution</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedDepartments && paginatedDepartments.length > 0 ? (
            paginatedDepartments.map((dept) => (
            <tr key={dept._id}>
              <td>{dept.DepartmentName}</td>
              <td>{dept.HodName}</td>
              <td>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {stats?.departmentData?.studentBreakdown[dept.DepartmentName] ? (
                    Object.entries(stats.departmentData.studentBreakdown[dept.DepartmentName])
                      .filter(([key]) => key !== 'total')
                      .map(([year, count]) => (
                        <span key={year} style={{ 
                           fontSize: '0.75rem', 
                           background: 'rgba(255,255,255,0.05)', 
                           padding: '2px 6px', 
                           borderRadius: '4px',
                           color: count > 0 ? '#60a5fa' : 'rgba(255,255,255,0.3)'
                        }}>
                          {year.split(' ')[0]}: <strong>{count}</strong>
                        </span>
                      ))
                  ) : "N/A"}
                </div>
              </td>
              <td>
                <button className="dash-btn" style={{ padding: "6px 12px", fontSize: "0.8rem", height: "auto", marginRight: "8px" }} onClick={() => handleEdit(dept)}>Edit</button>
                <button className="dash-btn danger" style={{ padding: "6px 12px", fontSize: "0.8rem", height: "auto" }} onClick={() => handleDelete(dept._id)}>Delete</button>
              </td>
            </tr>
          ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "rgba(255,255,255,0.5)" }}>No departments found.</td>
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
