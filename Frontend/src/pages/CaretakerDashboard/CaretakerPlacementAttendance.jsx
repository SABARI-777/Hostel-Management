import { useState, useEffect } from "react";
import { getCaretakerPlacementAttendance, addPlacementAttendance, updatePlacementAttendance, deletePlacementAttendance } from "../../api/caretaker";
import "./CaretakerDashboard.css";

export default function CaretakerPlacementAttendance() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [batchFilter, setBatchFilter] = useState("All");
    const [deptFilter, setDeptFilter] = useState("All");
    const [yearFilter, setYearFilter] = useState("All");
    const [roomFilter, setRoomFilter] = useState("All");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, batchFilter, deptFilter, yearFilter, roomFilter]);

    // CRUD States
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ Name: "", Status: "IN", EntryType: "MANUAL", OutDateTime: "" });
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getCaretakerPlacementAttendance(user._id);
            if (res.success) {
                setRecords(res.data);
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
        setBatchFilter("All");
        setDeptFilter("All");
        setYearFilter("All");
        setRoomFilter("All");
    };

    const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const openAddModal = () => {
        setEditId(null);
        setForm({ Name: "", Status: "IN", EntryType: "MANUAL", OutDateTime: new Date().toISOString() });
        setShowModal(true);
    };

    const openEditModal = (rec) => {
        setEditId(rec._id);
        setForm({ 
            Name: rec.StudentId?.Name || "", 
            Status: rec.Status, 
            EntryType: rec.EntryType, 
            OutDateTime: rec.OutDateTime || "" 
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = editId 
                ? await updatePlacementAttendance({ ...form, _id: editId, caretakerId: user._id }) 
                : await addPlacementAttendance({ ...form, caretakerId: user._id });
            if (res.message.includes("success")) {
                alert(`Placement log ${editId ? "updated" : "recorded"} successfully!`);
                setShowModal(false);
                fetchData();
            } else {
                alert(res.message || "Failed");
            }
        } catch (err) {
            alert("Error saving record");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this placement log?")) return;
        try {
            const res = await deletePlacementAttendance(id, user._id);
            if (res.message.includes("success")) {
                alert("Log deleted");
                fetchData();
            } else {
                alert("Delete failed");
            }
        } catch (err) {
            alert("Error deleting");
        }
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

    const uniqueBatches = getUniqueCaseInsensitive(records.map(r => r.PlacementId?.BatchName));
    const uniqueDepts = getUniqueCaseInsensitive(records.map(r => r.StudentId?.DepartmentId?.DepartmentName));

    const filteredRecords = records.filter(rec => {
        const matchesSearch = searchTerm === "" || 
            (rec.StudentId?.Name && rec.StudentId.Name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (rec.StudentId?.RegisterNumber && String(rec.StudentId.RegisterNumber).toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesBatch = batchFilter === "All" || 
            (rec.PlacementId?.BatchName && rec.PlacementId.BatchName.trim().toUpperCase() === batchFilter.toUpperCase());
        
        const matchesDept = deptFilter === "All" || 
            (rec.StudentId?.DepartmentId?.DepartmentName && rec.StudentId.DepartmentId.DepartmentName.trim().toUpperCase() === deptFilter.toUpperCase());
        
        const matchesYear = yearFilter === "All" || calculateYear(rec.StudentId?.StartYear) === yearFilter;
        
        const matchesRoom = roomFilter === "All" || 
            (rec.StudentId?.RoomId?.RoomNumber && String(rec.StudentId.RoomId.RoomNumber) === roomFilter) ||
            (rec.RoomId?.RoomNumber && String(rec.RoomId.RoomNumber) === roomFilter);
        
        return matchesSearch && matchesBatch && matchesDept && matchesYear && matchesRoom;
    });

    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

    if (loading) return <div className="glass-card">Loading Placement Training Logs...</div>;

    return (
        <div className="caretaker-placement animate-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: 0 }}>Placement Training Logs - Block {user.HostelBlock}</h2>
                <button onClick={openAddModal} className="action-btn btn-approve" style={{ padding: '12px 25px', fontSize: '1rem' }}>
                    + Manual Log
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
                        <label className="filter-label">Training Batch</label>
                        <select className="filter-control" value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)}>
                            <option value="All">All Batches</option>
                            {uniqueBatches.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Department</label>
                        <select className="filter-control" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                            <option value="All">All Departments</option>
                            {uniqueDepts.map(d => <option key={d} value={d}>{d}</option>)}
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
                        <label className="filter-label">Room Number</label>
                        <select className="filter-control" value={roomFilter} onChange={(e) => setRoomFilter(e.target.value)}>
                            <option value="All">All Rooms</option>
                            {[...new Set(records.map(r => r.StudentId?.RoomId?.RoomNumber || r.RoomId?.RoomNumber).filter(Boolean))].sort((a,b)=>a-b).map(room => (
                                <option key={room} value={room}>Room {room}</option>
                            ))}
                        </select>
                    </div>

                    {(searchTerm || batchFilter !== "All" || deptFilter !== "All" || yearFilter !== "All" || roomFilter !== "All") && (
                        <button className="clear-filters-btn" onClick={clearFilters}>RESET</button>
                    )}
                </div>
            </div>

            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <table className="ct-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Dept</th>
                            <th>Batch</th>
                            <th>Time Out</th>
                            <th>Time In</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedRecords && paginatedRecords.length > 0 ? (
                            paginatedRecords.map((rec) => (
                            <tr key={rec._id}>
                                <td>
                                    <div style={{ fontWeight: '700' }}>{rec.StudentId?.Name || "Deleted"}</div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{rec.StudentId?.RegisterNumber}</div>
                                </td>
                                <td>{rec.StudentId?.DepartmentId?.DepartmentName || "N/A"}</td>
                                <td><strong style={{ color: '#6ee7b7' }}>{rec.PlacementId?.BatchName || "N/A"}</strong></td>
                                <td>{new Date(rec.OutDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                <td>{rec.InDateTime ? new Date(rec.InDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}</td>
                                <td>
                                    <span className={`badge ${rec.Status === "IN" ? "badge-approved" : "badge-pending"}`}>
                                        {rec.Status === "IN" ? "RETURNED" : "OUTSIDE"}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => openEditModal(rec)} className="action-btn" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }}>Edit</button>
                                        <button onClick={() => handleDelete(rec._id)} className="action-btn btn-cancel">Del</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center", padding: '20px' }}>No logs found.</td>
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

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content animate-up" style={{ maxWidth: '500px' }}>
                        <h3 style={{ marginTop: 0, color: '#6ee7b7' }}>{editId ? "Update Log" : "Manual Placement Entry"}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="filter-group">
                                <label className="filter-label">Student Name</label>
                                <input className="filter-control" name="Name" value={form.Name} onChange={handleInputChange} required placeholder="Full Name" />
                            </div>
                            <div className="filter-group" style={{ marginTop: '20px' }}>
                                <label className="filter-label">Out DateTime</label>
                                <input className="filter-control" type="datetime-local" name="OutDateTime" value={form.OutDateTime.slice(0,16)} onChange={handleInputChange} required />
                            </div>
                            <div className="filter-group" style={{ marginTop: '20px' }}>
                                <label className="filter-label">Entry Status</label>
                                <select className="filter-control" name="Status" value={form.Status} onChange={handleInputChange}>
                                    <option value="IN">RETURNED (IN)</option>
                                    <option value="OUT">AUTHORIZED OUT</option>
                                </select>
                            </div>
                            <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
                                <button type="submit" className="action-btn btn-approve" style={{ flex: 1, padding: '15px' }} disabled={submitting}>
                                    {submitting ? "Saving..." : "Record Entry"}
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
