import { useState, useEffect } from "react";
import { getCaretakerStudents, addStudent, updateStudent, deleteStudent } from "../../api/caretaker";
import "./CaretakerDashboard.css";

export default function CaretakerStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roomFilter, setRoomFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  
  // CRUD States
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    Name: "", Gender: "Male", StartYear: "", Email: "", Section: "",
    RollNumber: "", RegisterNumber: "", Status: "ACTIVE", ParentMobileNumber: "", ParentEmail: "",
    DepartmentName: "", BatchName: "", RoomNumber: "", AdvisorName: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getCaretakerStudents(user._id);
      if (res.success) {
        setStudents(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user._id]);

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

  const clearFilters = () => {
    setSearchTerm("");
    setDeptFilter("All");
    setYearFilter("All");
    setStatusFilter("All");
    setRoomFilter("All");
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditId(null);
    setForm({
      Name: "", Gender: "Male", StartYear: new Date().getFullYear(), Email: "", Section: "A",
      RollNumber: "", RegisterNumber: "", Status: "ACTIVE", ParentMobileNumber: "", ParentEmail: "",
      DepartmentName: "", BatchName: "", RoomNumber: "", AdvisorName: ""
    });
    setShowModal(true);
  };

  const openEditModal = (stu) => {
    setEditId(stu._id);
    setForm({
      Name: stu.Name,
      Gender: stu.Gender,
      StartYear: stu.StartYear,
      Email: "LOCKED", 
      Section: stu.Section,
      RollNumber: stu.RollNumber,
      RegisterNumber: stu.RegisterNumber,
      Status: stu.Status,
      ParentMobileNumber: stu.ParentMobileNumber,
      ParentEmail: stu.ParentEmail || "",
      DepartmentName: "LOCKED",
      BatchName: "LOCKED",
      RoomNumber: "LOCKED",
      AdvisorName: "LOCKED"
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = editId 
        ? await updateStudent({ ...form, _id: editId, caretakerId: user._id }) 
        : await addStudent({ ...form, caretakerId: user._id });
      
      if (res.message.includes("success") || res.data) {
        alert(`Student ${editId ? "updated" : "added"} successfully!`);
        setShowModal(false);
        fetchData();
      } else {
        alert(res.message || "Operation failed");
      }
    } catch (err) {
      alert("Error processing student");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await deleteStudent(id, user._id);
      if (res.message.includes("success")) {
        alert("Student deleted successfully");
        fetchData();
      } else {
        alert(res.message || "Delete failed");
      }
    } catch (err) {
      alert("Error deleting student");
    }
  };

  const departments = [...new Set(students.map(s => s.DepartmentId?.DepartmentName).filter(Boolean))];

  if (loading) return <div className="glass-card">Loading Students...</div>;

  return (
    <div className="caretaker-students animate-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: 0 }}>Students - Block {user.HostelBlock}</h2>
        <button onClick={openAddModal} className="action-btn btn-approve" style={{ padding: '12px 25px', fontSize: '1rem' }}>
          + Enroll New Student
        </button>
      </div>

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
                  <label className="filter-label">Department</label>
                  <select className="filter-control" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                      <option value="All">All Departments</option>
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
              </div>

              <div className="filter-group">
                  <label className="filter-label">Academic Year</label>
                  <select className="filter-control" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
                      <option value="All">All Years</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="Final Year">Final Year</option>
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
                  {[...new Set(students.map(s => s.RoomId?.RoomNumber).filter(Boolean))].sort((a,b)=>a-b).map(room => (
                    <option key={room} value={room}>Room {room}</option>
                  ))}
                </select>
              </div>

              {(searchTerm || deptFilter !== "All" || yearFilter !== "All" || statusFilter !== "All" || roomFilter !== "All") && (
                  <button className="clear-filters-btn" onClick={clearFilters}>RESET</button>
              )}
          </div>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <table className="ct-table">
          <thead>
            <tr>
              <th>Student Info</th>
              <th>Reg No</th>
              <th>Dept</th>
              <th>Year</th>
              <th>Room</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students
              .filter(s => {
                const matchesSearch = searchTerm === "" || 
                    s.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (s.RegisterNumber || "").includes(searchTerm);
                const matchesDept = deptFilter === "All" || s.DepartmentId?.DepartmentName === deptFilter;
                const matchesYear = yearFilter === "All" || calculateYear(s.StartYear) === yearFilter;
                const matchesStatus = statusFilter === "All" || s.Status === statusFilter;
                const matchesRoom = roomFilter === "All" || String(s.RoomId?.RoomNumber) === roomFilter;
                return matchesSearch && matchesDept && matchesYear && matchesStatus && matchesRoom;
              })
              .map((student) => (
                <tr key={student._id}>
                  <td>
                    <div style={{ fontWeight: '700' }}>{student.Name}</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>Mob: {student.ParentMobileNumber}</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>Mail: {student.ParentEmail}</div>
                  </td>
                  <td>{student.RegisterNumber}</td>
                  <td>{student.DepartmentId?.DepartmentName || "N/A"}</td>
                  <td>{calculateYear(student.StartYear)}</td>
                  <td>{student.RoomId?.RoomNumber || "N/A"}</td>
                  <td>
                    <span className={`badge badge-${(student.Status || "active").toLowerCase()}`}>
                      {student.Status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => openEditModal(student)} className="action-btn" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }}>Edit</button>
                      <button onClick={() => handleDelete(student._id)} className="action-btn btn-cancel">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: '20px' }}>No students found in your block.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-up">
            <h3 style={{ marginTop: 0, color: '#6ee7b7' }}>{editId ? "Update Student" : "Enroll New Student"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="modal-grid">
                <div className="filter-group">
                  <label className="filter-label">Full Name</label>
                  <input className="filter-control" name="Name" value={form.Name} onChange={handleInputChange} required />
                </div>
                {!editId && (
                  <div className="filter-group">
                    <label className="filter-label">Auth Email</label>
                    <input className="filter-control" type="email" name="Email" value={form.Email} onChange={handleInputChange} required />
                  </div>
                )}
                <div className="filter-group">
                  <label className="filter-label">Gender</label>
                  <select className="filter-control" name="Gender" value={form.Gender} onChange={handleInputChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label className="filter-label">Start Year</label>
                  <input className="filter-control" type="number" name="StartYear" value={form.StartYear} onChange={handleInputChange} required />
                </div>
                <div className="filter-group">
                  <label className="filter-label">Reg Number</label>
                  <input className="filter-control" name="RegisterNumber" value={form.RegisterNumber} onChange={handleInputChange} required />
                </div>
                <div className="filter-group">
                  <label className="filter-label">Roll Number</label>
                  <input className="filter-control" name="RollNumber" value={form.RollNumber} onChange={handleInputChange} required />
                </div>
                <div className="filter-group">
                  <label className="filter-label">Section</label>
                  <input className="filter-control" name="Section" value={form.Section} onChange={handleInputChange} required />
                </div>
                <div className="filter-group">
                  <label className="filter-label">Parent Mobile</label>
                  <input className="filter-control" name="ParentMobileNumber" value={form.ParentMobileNumber} onChange={handleInputChange} required />
                </div>
                <div className="filter-group">
                  <label className="filter-label">Parent Email</label>
                  <input className="filter-control" type="email" name="ParentEmail" value={form.ParentEmail} onChange={handleInputChange} required />
                </div>
                {!editId && (
                  <>
                    <div className="filter-group">
                      <label className="filter-label">Department Name</label>
                      <input className="filter-control" name="DepartmentName" value={form.DepartmentName} onChange={handleInputChange} required placeholder="e.g. CSE" />
                    </div>
                    <div className="filter-group">
                      <label className="filter-label">Batch Name</label>
                      <input className="filter-control" name="BatchName" value={form.BatchName} onChange={handleInputChange} required placeholder="e.g. 2024" />
                    </div>
                    <div className="filter-group">
                      <label className="filter-label">Room Number</label>
                      <input className="filter-control" type="number" name="RoomNumber" value={form.RoomNumber} onChange={handleInputChange} required placeholder="101" />
                    </div>
                    <div className="filter-group">
                      <label className="filter-label">Advisor Name</label>
                      <input className="filter-control" name="AdvisorName" value={form.AdvisorName} onChange={handleInputChange} required placeholder="e.g. Dr. John" />
                    </div>
                  </>
                )}
                <div className="filter-group">
                  <label className="filter-label">Status</label>
                  <select className="filter-control" name="Status" value={form.Status} onChange={handleInputChange}>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="GRADUATED">Graduated</option>
                  </select>
                </div>
              </div>
              
              <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
                <button type="submit" className="action-btn btn-approve" style={{ flex: 1, padding: '15px' }} disabled={submitting}>
                  {submitting ? "Saving..." : editId ? "Update Student" : "Enroll Student"}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="action-btn btn-cancel" style={{ flex: 1, padding: '15px' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
