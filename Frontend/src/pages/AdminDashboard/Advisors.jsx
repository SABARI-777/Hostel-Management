import { useState, useEffect } from "react";
import "./AdminDashboard.css";

import { API } from "../../apiConfig";

export default function Advisors() {
  const [advisors, setAdvisors] = useState([]);
  const [form, setForm] = useState({
    Name: "",
    Email: "",
    Password: "Not Needed For Update", 
    Designation: "",
    DepartmentName: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [depts, setDepts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchFilters = async () => {
    try {
      const res = await fetch(`${API}/Admin/departments/d/details`);
      const data = await res.json();
      if (data.data) setDepts(data.data);
    } catch (err) { console.error(err); }
  };

  const fetchAdvisors = async () => {
    try {
      const res = await fetch(`${API}/Admin/advisors/a/details`);
      const data = await res.json();
      if (data.data) setAdvisors(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAdvisors();
    fetchFilters();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = editId ? `${API}/Admin/advisors/a/update` : `${API}/Admin/advisors/a/add`;
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
        alert(`Advisor ${editId ? "updated" : "assigned"} successfully!`);
        setForm({ Name: "", Email: "", Password: "Not Needed For Update", Designation: "", DepartmentName: "" });
        setEditId(null);
        fetchAdvisors();
      } else {
        alert(data.message || "Operation failed");
      }
    } catch (err) {
      alert("Error processing request");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (adv) => {
    setForm({
      Name: adv.Name,
      Email: adv.UserId?.Email || "Cannot Update Email",
      Password: "Not Needed For Update",
      Designation: adv.Designation,
      DepartmentName: adv.DepartmentId?.DepartmentName || "",
    });
    setEditId(adv._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this Advisor?")) return;
    try {
      const res = await fetch(`${API}/Admin/advisors/a/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      if (res.status === 200) {
        alert("Advisor deleted successfully");
        fetchAdvisors();
      } else {
        const data = await res.json();
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      alert("Error deleting advisor");
    }
  };

  const handleCancelEdit = () => {
    setForm({ Name: "", Email: "", Password: "Not Needed For Update", Designation: "", DepartmentName: "" });
    setEditId(null);
  };

  const filteredAdvisors = advisors.filter(adv => 
    searchTerm === "" || 
    (adv.Name && adv.Name.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (adv.DepartmentId?.DepartmentName && adv.DepartmentId.DepartmentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (adv.Designation && adv.Designation.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (adv.UserId?.Email && adv.UserId.Email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredAdvisors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAdvisors = filteredAdvisors.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="dashboard-card">
      <h3>Manage Advisors</h3>
      
      <form onSubmit={handleSubmit} className="dashboard-form">
        <div className="form-group">
          <label>Full Name</label>
          <input className="dash-input" name="Name" value={form.Name} onChange={handleChange} required />
        </div>
        {!editId && (
          <>
            <div className="form-group">
                <label>User Login Email</label>
                <input className="dash-input" type="email" name="Email" value={form.Email} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Vaildation Auth Role Password</label>
                <input className="dash-input" type="password" name="Password" value={form.Password === "Not Needed For Update" ? "" : form.Password} onChange={handleChange} required />
            </div>
          </>
        )}
        <div className="form-group">
          <label>Designation</label>
          <input 
            className="dash-input" 
            name="Designation" 
            value={form.Designation} 
            onChange={handleChange} 
            list="designation-suggestions"
            required 
          />
          <datalist id="designation-suggestions">
            <option value="Assistant Professor" />
            <option value="Associate Professor" />
            <option value="Professor" />
            <option value="HOD" />
          </datalist>
        </div>
        <div className="form-group">
          <label>Department Name</label>
          <input 
            className="dash-input" 
            name="DepartmentName" 
            value={form.DepartmentName} 
            onChange={handleChange} 
            list="dept-suggestions"
            required 
          />
          <datalist id="dept-suggestions">
            {depts.map(d => <option key={d._id} value={d.DepartmentName} />)}
          </datalist>
        </div>
        <div className="form-group" style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <button type="submit" className="dash-btn" disabled={loading}>
            {loading ? "Saving..." : editId ? "Update Advisor" : "Assign Advisor"}
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
              <label className="filter-label">Search Advisors</label>
              <input 
                type="text" 
                className="filter-control" 
                placeholder="Search by Name, Department, or Designation (e.g. Dr. Ramesh, CSE)..." 
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
            <th>Advisor Name</th>
            <th>Auth Email</th>
            <th>Faculty Designation</th>
            <th>Linked Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedAdvisors && paginatedAdvisors.length > 0 ? (
            paginatedAdvisors.map((adv) => (
            <tr key={adv._id}>
              <td><strong>{adv.Name}</strong></td>
              <td>{adv.UserId?.Email || "Unmapped"}</td>
              <td>{adv.Designation}</td>
              <td>{adv.DepartmentId?.DepartmentName || "N/A"}</td>
              <td>
                <button className="dash-btn" style={{ padding: "6px 12px", fontSize: "0.8rem", height: "auto", marginRight: "8px" }} onClick={() => handleEdit(adv)}>Edit</button>
                <button className="dash-btn danger" style={{ padding: "6px 12px", fontSize: "0.8rem", height: "auto" }} onClick={() => handleDelete(adv._id)}>Delete</button>
              </td>
            </tr>
          ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "rgba(255,255,255,0.5)" }}>No Advisors found.</td>
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
