import { useState, useEffect } from "react";
import "./AdminDashboard.css";

import { API } from "../../apiConfig";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    RoomNumber: "",
    HostelBlock: "",
    Capacity: "",
    Occupancy: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [blockFilter, setBlockFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/Admin/stats/overview`);
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (err) { console.error(err); }
  };

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API}/Admin/rooms/room/details`);
      const data = await res.json();
      if (data.data) setRooms(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchStats();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = editId ? `${API}/Admin/rooms/room/update` : `${API}/Admin/rooms/room/add`;
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
        alert(`Room ${editId ? "updated" : "created"} successfully!`);
        setForm({ RoomNumber: "", HostelBlock: "", Capacity: "", Occupancy: "" });
        setEditId(null);
        fetchRooms();
      } else {
        alert(data.message || "Operation failed");
      }
    } catch (err) {
      alert("Error processing request");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (room) => {
    setForm({
      RoomNumber: room.RoomNumber,
      HostelBlock: room.HostelBlock,
      Capacity: room.Capacity,
      Occupancy: room.Occupancy,
    });
    setEditId(room._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      const res = await fetch(`${API}/Admin/rooms/room/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      if (res.status === 200) {
        alert("Room deleted successfully");
        fetchRooms();
      } else {
        const data = await res.json();
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      alert("Error deleting room");
    }
  };

  const handleCancelEdit = () => {
    setForm({ RoomNumber: "", HostelBlock: "", Capacity: "", Occupancy: "" });
    setEditId(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setBlockFilter("All");
  };

  return (
    <div className="dashboard-card">
      <h3>Manage Rooms</h3>
      
      <form onSubmit={handleSubmit} className="dashboard-form">
        <div className="form-group">
          <label>Room Number</label>
          <input className="dash-input" name="RoomNumber" value={form.RoomNumber} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Hostel Block</label>
          <input className="dash-input" name="HostelBlock" value={form.HostelBlock} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Capacity</label>
          <input className="dash-input" name="Capacity" type="number" value={form.Capacity} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Occupancy</label>
          <input className="dash-input" name="Occupancy" type="number" value={form.Occupancy} onChange={handleChange} required />
        </div>
        <div className="form-group" style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <button type="submit" className="dash-btn" disabled={loading}>
            {loading ? "Saving..." : editId ? "Update Room" : "Add Room"}
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
              <label className="filter-label">Search Room</label>
              <input 
                type="text" 
                className="filter-control" 
                placeholder="Search by Room Number (e.g. 101, 204)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
          
          <div className="filter-row">
              <div className="filter-group">
                  <label className="filter-label">Hostel Block</label>
                  <select className="filter-control" value={blockFilter} onChange={(e) => setBlockFilter(e.target.value)}>
                      <option value="All">All Blocks</option>
                      {[...new Set(rooms.map(r => r.HostelBlock))].filter(Boolean).sort().map(block => (
                        <option key={block} value={block}>{block}</option>
                      ))}
                  </select>
              </div>

              {(searchTerm || blockFilter !== "All") && (
                <button className="clear-filters-btn" onClick={clearFilters}>RESET</button>
              )}
          </div>
      </div>

      <div style={{ overflowX: 'auto', marginTop: '15px' }}>
          <table className="premium-table">
        <thead>
            <tr>
              <th>Block Area</th>
              <th>Room Number</th>
              <th>Status</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms
              .filter(r => {
                const matchesSearch = searchTerm === "" || r.RoomNumber.toString().includes(searchTerm);
                const matchesBlock = blockFilter === "All" || r.HostelBlock === blockFilter;
                return matchesSearch && matchesBlock;
              })
              .map((room) => (
              <tr key={room._id}>
              <td>
                <strong>{room.HostelBlock || "N/A"}</strong>
                <div style={{ display: 'flex', gap: '4px', marginTop: '5px' }}>
                   {['1st Year', '2nd Year', '3rd Year', 'Final Year'].map(y => {
                      const count = stats?.hostelData?.blocks[room.HostelBlock]?.[y] || 0;
                      return count > 0 ? (
                        <span key={y} title={y} style={{ fontSize: '0.65rem', padding: '1px 4px', background: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa', borderRadius: '3px' }}>
                          {y.charAt(0)}{count}
                        </span>
                      ) : null;
                   })}
                </div>
              </td>
              <td><strong style={{ letterSpacing: '1px' }}>{room.RoomNumber}</strong></td>
              <td>{room.Occupancy} students</td>
              <td>{room.Capacity}</td>
              <td>{room.Occupancy}</td>
              <td>
                <button className="dash-btn" style={{ padding: "6px 12px", fontSize: "0.8rem", height: "auto", marginRight: "8px" }} onClick={() => handleEdit(room)}>Edit</button>
                <button className="dash-btn danger" style={{ padding: "6px 12px", fontSize: "0.8rem", height: "auto" }} onClick={() => handleDelete(room._id)}>Delete</button>
              </td>
            </tr>
          ))}
          {rooms.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "rgba(255,255,255,0.5)" }}>No rooms available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
  );
}
