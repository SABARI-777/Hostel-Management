import { useState, useEffect } from "react";
import "./AdminDashboard.css";

const API = "http://localhost:3000";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    Name: "",
    Gender: "Male",
    StartYear: "",
    Email: "",
    Section: "",
    RollNumber: "",
    RegisterNumber: "",
    Status: "ACTIVE",
    ParentMobileNumber: "",
    ParentEmail: "",
    DepartmentName: "",
    BatchName: "",
    RoomNumber: "",
    AdvisorName: ""
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [yearFilter, setYearFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [batchFilter, setBatchFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [roomFilter, setRoomFilter] = useState("All");
  
  const [depts, setDepts] = useState([]);
  const [batches, setBatches] = useState([]);

  const fetchFilters = async () => {
    try {
      const dRes = await fetch(`${API}/Admin/departments/d/details`);
      const dData = await dRes.json();
      if (dData.data) setDepts(dData.data);
      
      const bRes = await fetch(`${API}/Admin/placements/b/details`);
      const bData = await bRes.json();
      if (bData.data) setBatches(bData.data);
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

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API}/Admin/students/student/details`);
      const data = await res.json();
      if (data.data) setStudents(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchFilters();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = editId ? `${API}/Admin/students/student/update` : `${API}/Admin/students/add/student`;
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
        alert(`Student ${editId ? "updated" : "recorded"} successfully!`);
        setForm({
            Name: "", Gender: "Male", StartYear: "", Email: "", Section: "",
            RollNumber: "", RegisterNumber: "", Status: "Active", ParentMobileNumber: "",
            ParentEmail: "", DepartmentName: "", BatchName: "", RoomNumber: "", AdvisorName: ""
        });
        setEditId(null);
        fetchStudents();
      } else {
        alert(data.message || "Failed operation");
      }
    } catch (err) {
      alert("Error processing student");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (stu) => {
    setForm({
      Name: stu.Name,
      Gender: stu.Gender,
      StartYear: stu.StartYear,
      Email: "LOCKED_IN_EDIT", 
      Section: stu.Section,
      RollNumber: stu.RollNumber,
      RegisterNumber: stu.RegisterNumber,
      Status: stu.Status,
      ParentMobileNumber: stu.ParentMobileNumber,
      ParentEmail: stu.ParentEmail || "",
      DepartmentName: stu.DepartmentId?.DepartmentName || "",
      BatchName: stu.PlacementId?.BatchName || "",
      RoomNumber: stu.RoomId?.RoomNumber || "",
      AdvisorName: stu.AdvisorId?.Name || ""
    });
    setEditId(stu._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to completely erase this student?")) return;
    try {
      const res = await fetch(`${API}/Admin/students/student/delete/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      if (res.status === 200) {
        alert("Student deleted successfully");
        fetchStudents();
      } else {
        const data = await res.json();
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      alert("Error deleting student");
    }
  };

  const handleCancelEdit = () => {
    setForm({
        Name: "", Gender: "Male", StartYear: "", Email: "", Section: "",
        RollNumber: "", RegisterNumber: "", Status: "Active", ParentMobileNumber: "",
        ParentEmail: "", DepartmentName: "", BatchName: "", RoomNumber: "", AdvisorName: ""
    });
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

  return (
    <div className="dashboard-card" style={{ maxWidth: '100%'}}>
      <h3>Manage Enrolled Students</h3>
      
      <form onSubmit={handleSubmit} className="dashboard-form" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        <div className="form-group">
          <label>Full Name</label>
          <input className="dash-input" name="Name" value={form.Name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select className="dash-input" name="Gender" value={form.Gender} onChange={handleChange} required>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Start Year</label>
          <input className="dash-input" type="number" name="StartYear" value={form.StartYear} onChange={handleChange} required placeholder="2024" />
        </div>
        <div className="form-group">
          <label>Section</label>
          <input className="dash-input" name="Section" value={form.Section} onChange={handleChange} required placeholder="A" />
        </div>
        <div className="form-group">
          <label>Roll Number</label>
          <input className="dash-input" name="RollNumber" value={form.RollNumber} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Reg Number</label>
          <input className="dash-input" name="RegisterNumber" value={form.RegisterNumber} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Parent Mobile</label>
          <input className="dash-input" type="tel" name="ParentMobileNumber" value={form.ParentMobileNumber} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Parent Email</label>
          <input className="dash-input" type="email" name="ParentEmail" value={form.ParentEmail} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select className="dash-input" name="Status" value={form.Status} onChange={handleChange} required>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="GRADUATED">Graduated</option>
          </select>
        </div>

        {/* Relational Lockouts during Edit Mode because Backend strictly prevents modifying these after creation */}
        {!editId && (
            <>
                <div className="form-group">
                    <label>Auth User Email</label>
                    <input className="dash-input" type="email" name="Email" value={form.Email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Department Target</label>
                    <input 
                        className="dash-input" 
                        name="DepartmentName" 
                        value={form.DepartmentName} 
                        onChange={handleChange} 
                        list="dept-suggestions"
                        required 
                        placeholder="e.g. CSE" 
                    />
                    <datalist id="dept-suggestions">
                        {depts.map(d => <option key={d._id} value={d.DepartmentName} />)}
                    </datalist>
                </div>
                <div className="form-group">
                    <label>Placement Batch</label>
                    <input 
                        className="dash-input" 
                        name="BatchName" 
                        value={form.BatchName} 
                        onChange={handleChange} 
                        list="batch-suggestions"
                        required 
                        placeholder="e.g. AZ" 
                    />
                    <datalist id="batch-suggestions">
                        {batches.map(b => <option key={b._id} value={b.BatchName} />)}
                    </datalist>
                </div>
                <div className="form-group">
                    <label>Hostel Room No.</label>
                    <input className="dash-input" type="number" name="RoomNumber" value={form.RoomNumber} onChange={handleChange} required placeholder="101" />
                </div>
            </>
        )}

        <div className="form-group">
            <label>Primary Advisor</label>
            <input className="dash-input" name="AdvisorName" value={form.AdvisorName} onChange={handleChange} required placeholder="e.g. Dr. John" />
        </div>

        <div className="form-group" style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <button type="submit" className="dash-btn" disabled={loading}>
            {loading ? "Saving..." : editId ? "Update Student" : "Enroll Student"}
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
                placeholder="Name, Register Number, or Email..." 
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
                      {depts.map(d => <option key={d._id} value={d.DepartmentName}>{d.DepartmentName}</option>)}
                  </select>
              </div>

              <div className="filter-group">
                  <label className="filter-label">Placement Batch</label>
                  <select className="filter-control" value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)}>
                      <option value="All">All Batches</option>
                      {batches.map(b => <option key={b._id} value={b.BatchName}>{b.BatchName}</option>)}
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
                  <label className="filter-label">Status</label>
                  <select className="filter-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                      <option value="All">All Status</option>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="GRADUATED">Graduated</option>
                  </select>
              </div>

              <div className="filter-group">
                  <label className="filter-label">Room Number</label>
                  <select className="filter-control" value={roomFilter} onChange={(e) => setRoomFilter(e.target.value)}>
                      <option value="All">All Rooms</option>
                      {[...new Set(students.map(s => s.RoomId?.RoomNumber).filter(Boolean))].sort((a,b)=>a-b).map(rooms => (
                        <option key={rooms} value={rooms}>Room {rooms}</option>
                      ))}
                  </select>
              </div>

              {(searchTerm || yearFilter !== "All" || deptFilter !== "All" || batchFilter !== "All" || genderFilter !== "All" || statusFilter !== "All" || roomFilter !== "All") && (
                <button className="clear-filters-btn" onClick={clearFilters}>RESET</button>
              )}
          </div>
      </div>

      <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table className="premium-table" style={{ whiteSpace: 'nowrap' }}>
            <thead>
              <tr>
                <th>Reg No.</th>
                <th>Roll No.</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Auth Email</th>
                <th>StartYr</th>
                <th>Parent Mobile</th>
                <th>Sec</th>
                <th>Room</th>
                <th>Dept</th>
                <th>Batch</th>
                <th>Advisor</th>
                <th>Year</th>
                <th>Late Entries</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students
                .filter(stu => {
                  const matchesSearch = searchTerm === "" || 
                    stu.Name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    stu.RegisterNumber.includes(searchTerm) || 
                    stu.RollNumber.includes(searchTerm);
                  const matchesYear = yearFilter === "All" || calculateYear(stu.StartYear) === yearFilter;
                  const matchesDept = deptFilter === "All" || stu.DepartmentId?.DepartmentName === deptFilter;
                  const matchesBatch = batchFilter === "All" || stu.PlacementId?.BatchName === batchFilter;
                  const matchesGender = genderFilter === "All" || stu.Gender === genderFilter;
                  const matchesStatus = statusFilter === "All" || stu.Status === statusFilter;
                  const matchesRoom = roomFilter === "All" || String(stu.RoomId?.RoomNumber) === roomFilter;
                  
                  return matchesSearch && matchesYear && matchesDept && matchesBatch && matchesGender && matchesStatus && matchesRoom;
                })
                .map((stu) => (
                <tr key={stu._id}>
                  <td><strong style={{ opacity: 0.8 }}>{stu.RegisterNumber}</strong></td>
                  <td>{stu.RollNumber}</td>
                  <td>{stu.Name}</td>
                  <td>{stu.Gender}</td>
                  <td>{stu.UserId?.Email || "Unmapped"}</td>
                  <td>{stu.StartYear}</td>
                  <td>{stu.ParentMobileNumber || "N/A"}</td>
                  <td>{stu.Section}</td>
                  <td>{stu.RoomId?.RoomNumber || "Unassigned"}</td>
                  <td>{stu.DepartmentId?.DepartmentName || "N/A"}</td>
                  <td>{stu.PlacementId?.BatchName || "N/A"}</td>
                  <td>{stu.AdvisorId?.Name || "None"}</td>
                  <td style={{ fontWeight: 'bold', color: '#60a5fa' }}>{calculateYear(stu.StartYear)}</td>
                  <td style={{ textAlign: "center" }}>
                    {stu.LateEntryCount > 0 ? (
                      <span style={{ color: "#f87171", fontWeight: "bold" }}>{stu.LateEntryCount}</span>
                    ) : (
                      <span style={{ opacity: 0.5 }}>0</span>
                    )}
                  </td>
                  <td>
                    <span style={{
                      padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem",
                      background: stu.Status === "ACTIVE" ? "rgba(40, 167, 69, 0.2)" : "rgba(220, 53, 69, 0.2)",
                      color: stu.Status === "ACTIVE" ? "#28a745" : "#dc3545"
                    }}>
                      {stu.Status}
                    </span>
                  </td>
                  <td>
                    <button className="dash-btn" style={{ padding: "6px 12px", fontSize: "0.8rem", height: "auto", marginRight: "8px" }} onClick={() => handleEdit(stu)}>Edit</button>
                    <button className="dash-btn danger" style={{ padding: "6px 12px", fontSize: "0.8rem", height: "auto" }} onClick={() => handleDelete(stu._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "20px", color: "rgba(255,255,255,0.5)" }}>No enrolled students</td>
                </tr>
              )}
            </tbody>
          </table>
      </div>
    </div>
  );
}
