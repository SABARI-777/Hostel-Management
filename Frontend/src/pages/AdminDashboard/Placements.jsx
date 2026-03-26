import { useState, useEffect } from "react";
import "./AdminDashboard.css";

const API = "http://localhost:3000";

// Dynamic batch options will be derived from existing data
const DAY_OPTIONS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

export default function Placements() {
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState({
    BatchName: "AZ",
    Days: [],
    Start: "",
    End: "",
    Status: "UPCOMING"
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBatches = async () => {
    try {
      const res = await fetch(`${API}/Admin/placements/b/details`);
      const data = await res.json();
      if (data.data) setBatches(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleDayChange = (day) => {
    if (form.Days.includes(day)) {
      setForm({ ...form, Days: form.Days.filter(d => d !== day) });
    } else {
      setForm({ ...form, Days: [...form.Days, day] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.Days.length === 0) {
      alert("Please select at least one day!");
      return;
    }
    setLoading(true);
    const url = editId ? `${API}/Admin/placements/b/update` : `${API}/Admin/placements/b/add`;
    const method = editId ? "PATCH" : "POST";
    
    // Exact schema matching payload mapping
    const payload = {
      BatchName: form.BatchName,
      Days: form.Days,
      ClassTiming: {
        Start: form.Start,
        End: form.End
      },
      Status: form.Status
    };
    if (editId) payload.id = editId;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.status === 201 || res.status === 200) {
        alert(`Placement Batch ${editId ? "updated" : "added"} successfully!`);
        setForm({ BatchName: "AZ", Days: [], Start: "", End: "", Status: "UPCOMING" });
        setEditId(null);
        fetchBatches();
      } else {
        alert(data.message || "Operation failed");
      }
    } catch (err) {
      alert("Error processing request");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (batch) => {
    setForm({
      BatchName: batch.BatchName || "AZ",
      Days: batch.Days || [],
      Start: batch.ClassTiming?.Start || "",
      End: batch.ClassTiming?.End || "",
      Status: batch.Status || "UPCOMING",
    });
    setEditId(batch._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Placement Batch?")) return;
    try {
      const res = await fetch(`${API}/Admin/placements/b/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }), 
      });
      if (res.status === 200) {
        alert("Batch deleted successfully");
        fetchBatches();
      } else {
        const data = await res.json();
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      alert("Error deleting batch");
    }
  };

  const handleCancelEdit = () => {
    setForm({ BatchName: "AZ", Days: [], Start: "", End: "", Status: "UPCOMING" });
    setEditId(null);
  };

  return (
    <div className="dashboard-card">
      <h3>Manage Placement Batches</h3>
      
      <form onSubmit={handleSubmit} className="dashboard-form">
        <div className="form-group">
          <label>Batch Target Name</label>
          <input 
            className="dash-input" 
            name="BatchName" 
            value={form.BatchName} 
            onChange={handleChange} 
            list="batch-suggestions"
            placeholder="Type or select a batch..."
            required 
          />
          <datalist id="batch-suggestions">
            {[...new Set(batches.map(b => b.BatchName))].map(b => (
              <option key={b} value={b} />
            ))}
          </datalist>
        </div>

        <div className="form-group" style={{ gridColumn: "1 / -1", display: 'flex', flexDirection: 'column', gap: '8px'}}>
          <label>Operating Days</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {DAY_OPTIONS.map(day => (
              <label key={day} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={form.Days.includes(day)}
                  onChange={() => handleDayChange(day)}
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Class Start Time</label>
          <input className="dash-input" type="time" name="Start" value={form.Start} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Class End Time</label>
          <input className="dash-input" type="time" name="End" value={form.End} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select className="dash-input" name="Status" value={form.Status} onChange={handleChange} required>
            <option value="UPCOMING">Upcoming</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="form-group" style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <button type="submit" className="dash-btn" disabled={loading}>
            {loading ? "Saving..." : editId ? "Update Batch" : "Add Batch"}
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
              <label className="filter-label">Search Batches</label>
              <input 
                type="text" 
                className="filter-control" 
                placeholder="Search by Batch Name (e.g. AZ, Placement 2024)..." 
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
            <th>Batch Core</th>
            <th>Schedule</th>
            <th>Timing</th>
            <th>Live Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {batches
            .filter(batch => 
              searchTerm === "" || 
              batch.BatchName.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((batch) => (
            <tr key={batch._id}>
              <td><strong style={{ letterSpacing: '1px' }}>{batch.BatchName}</strong></td>
              <td style={{ fontSize: '0.85rem' }}>{batch.Days?.join(", ")}</td>
              <td>{batch.ClassTiming?.Start} - {batch.ClassTiming?.End}</td>
              <td>
                <span style={{
                  padding: "4px 8px", 
                  borderRadius: "4px",
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  background: batch.Status === "ONGOING" ? "rgba(40, 167, 69, 0.2)" : (batch.Status === "UPCOMING" ? "rgba(0, 123, 255, 0.2)" : "rgba(108, 117, 125, 0.2)"),
                  color: batch.Status === "ONGOING" ? "#28a745" : (batch.Status === "UPCOMING" ? "#007bff" : "#adb5bd")
                }}>
                  {batch.Status}
                </span>
              </td>
              <td>
                <button className="dash-btn" style={{ padding: "6px 12px", fontSize: "0.8rem", height: "auto", marginRight: "8px" }} onClick={() => handleEdit(batch)}>Edit</button>
                <button className="dash-btn danger" style={{ padding: "6px 12px", fontSize: "0.8rem", height: "auto" }} onClick={() => handleDelete(batch._id)}>Delete</button>
              </td>
            </tr>
          ))}
          {batches.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "rgba(255,255,255,0.5)" }}>No placement batches recorded</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
