import { useState, useEffect } from "react";
import "./AdminDashboard.css";

import { API } from "../../apiConfig";

export default function PlacementAttendance() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    Name: "",
    EntryType: "MANUAL",
    Status: "OUT",
    OutDateTime: "",
    BatchName: ""
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [yearFilter, setYearFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [batchFilter, setBatchFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const [batches, setBatches] = useState([]);
  const [depts, setDepts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roomFilter, setRoomFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, yearFilter, deptFilter, batchFilter, genderFilter, statusFilter, roomFilter]);

  const fetchFilters = async () => {
    try {
      const bRes = await fetch(`${API}/Admin/placements/b/details`);
      const bData = await bRes.json();
      if (bData.data) setBatches(bData.data);
      
      const dRes = await fetch(`${API}/Admin/departments/d/details`);
      const dData = await dRes.json();
      if (dData.data) setDepts(dData.data);
    } catch (err) { console.error(err); }
  };

  const calculateYear = (startYear) => {
    if (!startYear) return "N/A";
    const currentYear = new Date().getFullYear();
    const diff = currentYear - startYear;
    if (diff <= 1) return "1st Year";
    if (diff === 2) return "2nd Year";
    if (diff === 3) return "3rd Year";
    if (diff === 4) return "Final Year";
    if (diff >= 5) return "Graduate";
    return "N/A";
  };

  const fetchBatches = async () => {
    try {
      const res = await fetch(`${API}/Admin/placements/b/details`);
      const data = await res.json();
      if (data.data) setBatches(data.data);
    } catch (err) { console.error(err); }
  };

  const fetchRecords = async () => {
    try {
      const res = await fetch(`${API}/Admin/placement-attendance/p/entry/details`);
      const data = await res.json();
      if (data.data) setRecords(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchFilters();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = editId ? `${API}/Admin/placement-attendance/p/entry/update` : `${API}/Admin/placement-attendance/p/entry/add`;
    const method = editId ? "PATCH" : "POST";
    
    // Convert empty out-date to something manageable or strip it entirely if undefined
    const body = editId ? { ...form, _id: editId } : { ...form };
    if (!body.OutDateTime) delete body.OutDateTime; 

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.status === 201 || res.status === 200) {
        alert(`Placement Attendance ${editId ? "updated" : "recorded"} successfully!`);
        setForm({ Name: "", EntryType: "MANUAL", Status: "OUT", OutDateTime: "", BatchName: "" });
        setEditId(null);
        fetchRecords();
      } else {
        alert(data.message || "Failed operation");
      }
    } catch (err) {
      alert("Error recording attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rec) => {
    // Convert Mongo ISODate format to HTML datetime-local format (YYYY-MM-DDThh:mm)
    const outDateFormatted = rec.OutDateTime ? new Date(rec.OutDateTime).toISOString().slice(0, 16) : "";

    setForm({
      Name: rec.StudentId?.Name || "",
      EntryType: rec.EntryType || "MANUAL",
      Status: rec.Status || "OUT",
      OutDateTime: outDateFormatted,
      BatchName: rec.PlacementId?.BatchName || ""
    });
    setEditId(rec._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this placement log?")) return;
    try {
      const res = await fetch(`${API}/Admin/placement-attendance/p/entry/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      if (res.status === 200) {
        alert("Placement log deleted successfully");
        fetchRecords();
      } else {
        const data = await res.json();
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      alert("Error deleting placement log");
    }
  };

  const handleCancelEdit = () => {
    setForm({ Name: "", EntryType: "MANUAL", Status: "OUT", OutDateTime: "", BatchName: "" });
    setEditId(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setYearFilter("All");
    setDeptFilter("All");
    setBatchFilter("All");
    setGenderFilter("All");
    setStatusFilter("All");
    setRoomFilter("All");
  };

  const getUniqueCaseInsensitive = (arr) => {
    const seen = new Set();
    return arr.filter(item => {
      if (!item) return false;
      const upper = item.trim().toUpperCase();
      if (seen.has(upper)) return false;
      seen.add(upper);
      return true;
    }).map(item => item.trim());
  };

  const uniqueDepts = getUniqueCaseInsensitive(depts.map(d => d.DepartmentName));
  const uniqueBatches = getUniqueCaseInsensitive(batches.map(b => b.BatchName));

  const filteredRecords = records.filter(rec => {
    const matchesSearch = searchTerm === "" || 
      (rec.StudentId?.Name && rec.StudentId.Name.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (rec.StudentId?.RegisterNumber && String(rec.StudentId.RegisterNumber).toLowerCase().includes(searchTerm.toLowerCase())) ||
      (rec.StudentId?.RollNumber && String(rec.StudentId.RollNumber).toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesYear = yearFilter === "All" || calculateYear(rec.StudentId?.StartYear) === yearFilter;
    
    const matchesDept = deptFilter === "All" || 
      (rec.StudentId?.DepartmentId?.DepartmentName && rec.StudentId.DepartmentId.DepartmentName.trim().toUpperCase() === deptFilter.toUpperCase());
    
    const matchesBatch = batchFilter === "All" || 
      (rec.PlacementId?.BatchName && rec.PlacementId.BatchName.trim().toUpperCase() === batchFilter.toUpperCase());
    
    const matchesGender = genderFilter === "All" || 
      (rec.StudentId?.Gender && rec.StudentId.Gender.trim().toUpperCase() === genderFilter.toUpperCase());
    
    const matchesStatus = statusFilter === "All" || 
      (rec.Status && rec.Status.trim().toUpperCase() === statusFilter.toUpperCase());
    
    const matchesRoom = roomFilter === "All" || 
      (rec.StudentId?.RoomId?.RoomNumber && String(rec.StudentId.RoomId.RoomNumber) === roomFilter) ||
      (rec.RoomId?.RoomNumber && String(rec.RoomId.RoomNumber) === roomFilter);
    
    return matchesSearch && matchesYear && matchesDept && matchesBatch && matchesGender && matchesStatus && matchesRoom;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="dashboard-card">
      <h3>Placement Attendance Logs</h3>
      
      <form onSubmit={handleSubmit} className="dashboard-form">
        <div className="form-group">
          <label>Student Name</label>
          <input className="dash-input" name="Name" value={form.Name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Entry Type</label>
          <select className="dash-input" name="EntryType" value={form.EntryType} onChange={handleChange} required>
            <option value="MANUAL">MANUAL</option>
            <option value="BIOMETRIC">BIOMETRIC</option>
          </select>
        </div>
        <div className="form-group">
          <label>Status</label>
          <select className="dash-input" name="Status" value={form.Status} onChange={handleChange} required>
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
          </select>
        </div>
        <div className="form-group">
          <label>Out Date/Time (Optional)</label>
          <input className="dash-input" type="datetime-local" name="OutDateTime" value={form.OutDateTime} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Placement Batch (Optional)</label>
          <input 
            className="dash-input" 
            name="BatchName" 
            value={form.BatchName} 
            onChange={handleChange} 
            list="batch-suggestions"
            placeholder="Type or select a batch..."
          />
          <datalist id="batch-suggestions">
            {uniqueBatches.map(bName => (
              <option key={bName} value={bName} />
            ))}
          </datalist>
        </div>
        <div className="form-group" style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <button type="submit" className="dash-btn" disabled={loading}>
            {loading ? "Saving..." : editId ? "Update Log" : "Record Log"}
          </button>
          {editId && (
            <button type="button" className="dash-btn danger" style={{ marginLeft: "10px" }} onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

          {/* SEARCH AND FILTERS */}
      <div className="filter-hub" style={{ marginTop: '40px' }}>
          <div className="filter-group search">
              <label className="filter-label">Search Student</label>
              <input 
                type="text" 
                className="filter-control" 
                placeholder="Name, Registration Number, or Email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
          
          <div className="filter-row">
              <div className="filter-group">
                  <label className="filter-label">Academic Year</label>
                  <select className="filter-control" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
                      <option value="All">All Years</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="Final Year">Final Year</option>
                      <option value="Graduate">Graduate</option>
                  </select>
              </div>

               <div className="filter-group">
                  <label className="filter-label">Department</label>
                  <select className="filter-control" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                      <option value="All">All Depts</option>
                      {uniqueDepts.map(dName => <option key={dName} value={dName}>{dName}</option>)}
                  </select>
              </div>

              <div className="filter-group">
                  <label className="filter-label">Placement Batch</label>
                  <select className="filter-control" value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)}>
                      <option value="All">All Batches</option>
                      {uniqueBatches.map(bName => <option key={bName} value={bName}>{bName}</option>)}
                  </select>
              </div>

              <div className="filter-group">
                  <label className="filter-label">Gender</label>
                  <select className="filter-control" value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
                      <option value="All">All Genders</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                  </select>
              </div>

              <div className="filter-group">
                  <label className="filter-label">Stay Status</label>
                  <select className="filter-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                      <option value="All">All Status</option>
                      <option value="IN">IN</option>
                      <option value="OUT">OUT</option>
                  </select>
              </div>

              <div className="filter-group">
                  <label className="filter-label">Room Number</label>
                  <select className="filter-control" value={roomFilter} onChange={(e) => setRoomFilter(e.target.value)}>
                      <option value="All">All Rooms</option>
                      {[...new Set(records.map(r => r.StudentId?.RoomId?.RoomNumber || r.RoomId?.RoomNumber).filter(Boolean))].sort((a,b)=>a-b).map(room => (
                          <option key={room} value={room}>Room {room}</option>
                      ))}
                  </select>
              </div>

              {(searchTerm || yearFilter !== "All" || deptFilter !== "All" || batchFilter !== "All" || genderFilter !== "All" || statusFilter !== "All" || roomFilter !== "All") && (
                <button className="clear-filters-btn" onClick={clearFilters}>RESET</button>
              )}
          </div>
      </div>

      <div style={{ overflowX: 'auto', marginTop: '15px' }}>
          <table className="premium-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Dept</th>
            <th>Year</th>
            <th>Type</th>
            <th>L.Status</th>
            <th>Log Time</th>
            <th>Batch</th>
            <th>S.Status</th>
            <th>Actions</th>
          </tr>
        </thead>
         <tbody>
          {paginatedRecords && paginatedRecords.length > 0 ? (
            paginatedRecords.map((rec) => (
            <tr key={rec._id}>
              <td>
                <div>{rec.StudentId?.Name || "Unknown"}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{rec.StudentId?.ParentMobileNumber}</div>
              </td>
              <td><span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{rec.StudentId?.DepartmentId?.DepartmentName || "N/A"}</span></td>
              <td style={{ fontWeight: 'bold', color: '#60a5fa' }}>{calculateYear(rec.StudentId?.StartYear)}</td>
              <td>
                <span style={{
                  padding: "4px 8px", 
                  borderRadius: "4px",
                  background: rec.EntryType === "BIOMETRIC" ? "rgba(40, 167, 69, 0.2)" : "rgba(255, 193, 7, 0.2)",
                  color: rec.EntryType === "BIOMETRIC" ? "#28a745" : "#ffc107"
                }}>
                  {rec.EntryType}
                </span>
              </td>
              <td>{rec.Status}</td>
              <td style={{ fontSize: '0.8rem' }}>
                <div>In: {rec.InDateTime ? new Date(rec.InDateTime).toLocaleTimeString() : "N/A"}</div>
                <div>Out: {rec.OutDateTime ? new Date(rec.OutDateTime).toLocaleTimeString() : "Pending"}</div>
              </td>
              <td><strong style={{ opacity: 0.8 }}>{rec.PlacementId?.BatchName || "N/A"}</strong></td>
              <td>
                <span style={{
                   padding: "2px 6px", borderRadius: "4px", fontSize: "0.75rem",
                   background: rec.StudentId?.Status === "Active" ? "rgba(40, 167, 69, 0.1)" : "rgba(255, 255, 255, 0.05)",
                   color: rec.StudentId?.Status === "Active" ? "#28a745" : "rgba(255,255,255,0.4)"
                }}>
                  {rec.StudentId?.Status || "N/A"}
                </span>
              </td>
              <td>
                <button className="dash-btn" style={{ padding: "6px 12px", fontSize: "0.8rem", height: "auto", marginRight: "8px" }} onClick={() => handleEdit(rec)}>Edit</button>
                <button className="dash-btn danger" style={{ padding: "6px 12px", fontSize: "0.8rem", height: "auto" }} onClick={() => handleDelete(rec._id)}>Delete</button>
              </td>
            </tr>
          ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center", padding: "20px", color: "rgba(255,255,255,0.5)" }}>No placement attendance logs found.</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

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
