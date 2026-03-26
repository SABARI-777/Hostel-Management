import { useState, useEffect } from "react";
import "./AdminDashboard.css";

const API = "http://localhost:3000";

export default function PassManagement() {
  const [homePasses, setHomePasses] = useState([]);
  const [normalPasses, setNormalPasses] = useState([]);
  const [emergencyPasses, setEmergencyPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [passIdFilter, setPassIdFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [depts, setDepts] = useState([]);

  const calculateYear = (startYear) => {
    if (!startYear) return "N/A";
    const currentYear = new Date().getFullYear();
    const diff = currentYear - startYear;
    if (diff === 1) return "1st Year";
    if (diff === 2) return "2nd Year";
    if (diff === 3) return "3rd Year";
    if (diff === 4) return "Final Year";
    if (diff >= 5) return "Graduate";
    return "Unknown";
  };

  const fetchPasses = async () => {
    try {
      setLoading(true);
      const [homeRes, normalRes, emgRes, deptRes] = await Promise.all([
        fetch(`${API}/Admin/passes/out/o/entry/details`).then((res) => res.json()).catch(() => ({ data: [] })),
        fetch(`${API}/Admin/passes/general/g/entry/details`).then((res) => res.json()).catch(() => ({ data: [] })),
        fetch(`${API}/Admin/passes/emergency/e/entry/details`).then((res) => res.json()).catch(() => ({ data: [] })),
        fetch(`${API}/Admin/departments/d/details`).then((res) => res.json()).catch(() => ({ data: [] })),
      ]);

      setHomePasses(homeRes.data && Array.isArray(homeRes.data) ? homeRes.data : []);
      setNormalPasses(normalRes.data && Array.isArray(normalRes.data) ? normalRes.data : []);
      setEmergencyPasses(emgRes.data && Array.isArray(emgRes.data) ? emgRes.data : []);
      if (deptRes.data) setDepts(deptRes.data);
    } catch (err) {
      console.error("Error fetching passes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasses();
  }, []);

  const handleApprove = async (pass, type) => {
    try {
      let typeNum = 1;
      if (type === "home") typeNum = 1;
      else if (type === "normal") typeNum = 2;
      else if (type === "emergency") typeNum = 3;

      const payload = {
        _id: pass._id,
        Type: typeNum
      };

      const res = await fetch(`${API}/Admin/passes/approve/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Pass Approved Successfully");
        fetchPasses();
      } else {
        alert("Failed to approve pass: " + data.message);
      }
    } catch (err) {
      console.error("Approval Error:", err);
      alert("Error approving pass. See console for details.");
    }
  };

  const handleReject = async (pass, type) => {
    if (!window.confirm("Are you sure you want to cancel/reject this pass?")) return;
    try {
      let typeNum = 1;
      if (type === "home") typeNum = 1;
      else if (type === "normal") typeNum = 2;
      else if (type === "emergency") typeNum = 3;

      const payload = { _id: pass._id, Type: typeNum };

      const res = await fetch(`${API}/Admin/passes/cancel/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Pass Rejected Successfully");
        fetchPasses();
      } else {
        alert("Failed to reject pass: " + data.message);
      }
    } catch (err) {
      console.error("Rejection Error:", err);
      alert("Error rejecting pass. See console for details.");
    }
  };

  // Analytics processing
  const allPasses = [...homePasses, ...normalPasses, ...emergencyPasses];
  const totalPasses = allPasses.length;
  const totalOut = allPasses.filter((p) => p.Status === "OUT").length;
  const totalIn = allPasses.filter((p) => p.Status === "IN").length;

  
  // Late pass calculation: OUT status but OutDateTime is > 24 hours ago (as a simple heuristic for now)
  const latePasses = allPasses.filter((p) => {
    if (p.Status !== "OUT") return false;
    if (!p.OutDateTime) return false;
    const outDate = new Date(p.OutDateTime);
    const hoursOut = (new Date() - outDate) / (1000 * 60 * 60);
    return hoursOut > 24;
  }).length;

  const getDisplayedPasses = () => {
    let list = [];
    if (activeTab === "home") list = homePasses;
    else if (activeTab === "normal") list = normalPasses;
    else if (activeTab === "emergency") list = emergencyPasses;

    return list.filter(pass => {
      const matchesSearch = searchTerm === "" || 
        (pass.StudentId?.Name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
        (pass.StudentId?.RegisterNumber || "").includes(searchTerm);
      const matchesPassId = passIdFilter === "" || (pass.PassId && pass.PassId.toString() === passIdFilter);
      const matchesYear = yearFilter === "All" || calculateYear(pass.StudentId?.StartYear) === yearFilter;
      const matchesDept = deptFilter === "All" || pass.StudentId?.DepartmentId?.DepartmentName === deptFilter;
      
      return matchesSearch && matchesPassId && matchesYear && matchesDept;
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPassIdFilter("");
    setYearFilter("All");
    setDeptFilter("All");
  };

  const displayedList = getDisplayedPasses();

  return (
    <div className="dashboard-container" style={{ paddingBottom: "50px" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: "white", margin: "0", fontSize: '2.2rem' }}>Gate Pass Management Center</h2>
        <button className="dash-btn" onClick={fetchPasses} style={{ height: 'auto', padding: '10px 20px' }}>Refresh Data</button>
      </div>

      {/* ANALYTICS SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '15px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ color: '#aaa', fontSize: '1rem', marginBottom: '10px' }}>Total Passes Logged</div>
          <div style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 'bold' }}>{totalPasses}</div>
        </div>
        <div style={{ background: 'rgba(40, 167, 69, 0.1)', borderRadius: '15px', padding: '20px', border: '1px solid rgba(40,167,69,0.3)' }}>
          <div style={{ color: '#aaa', fontSize: '1rem', marginBottom: '10px' }}>Currently OUT</div>
          <div style={{ color: '#28a745', fontSize: '2.5rem', fontWeight: 'bold' }}>{totalOut}</div>
        </div>
        <div style={{ background: 'rgba(0, 123, 255, 0.1)', borderRadius: '15px', padding: '20px', border: '1px solid rgba(0,123,255,0.3)' }}>
          <div style={{ color: '#aaa', fontSize: '1rem', marginBottom: '10px' }}>Returned IN</div>
          <div style={{ color: '#007bff', fontSize: '2.5rem', fontWeight: 'bold' }}>{totalIn}</div>
        </div>
        <div style={{ background: 'rgba(220, 53, 69, 0.1)', borderRadius: '15px', padding: '20px', border: '1px solid rgba(220,53,69,0.3)' }}>
          <div style={{ color: '#aaa', fontSize: '1rem', marginBottom: '10px' }}>Late / Overdue</div>
          <div style={{ color: '#dc3545', fontSize: '2.5rem', fontWeight: 'bold' }}>{latePasses}</div>
        </div>
      </div>
      
      {/* SEARCH AND FILTERS */}
      <div className="filter-hub">
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
                  <label className="filter-label">Pass ID #</label>
                  <input 
                    type="text" 
                    className="filter-control" 
                    placeholder="Search by Pass ID..." 
                    value={passIdFilter}
                    onChange={(e) => setPassIdFilter(e.target.value)}
                  />
              </div>
              
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

              {(searchTerm || passIdFilter || yearFilter !== "All" || deptFilter !== "All") && (
                <button className="clear-filters-btn" onClick={clearFilters}>RESET</button>
              )}
          </div>
      </div>

      <div className="dashboard-card" style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '15px' }}>
        {/* TABS */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
          <button 
            className={`tab-btn ${activeTab === "home" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("home")}
            style={{ padding: '15px 30px', background: 'transparent', border: 'none', color: activeTab === 'home' ? '#fff' : '#888', borderBottom: activeTab === 'home' ? '3px solid #007bff' : 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}
          >
            Home Pass (Outpass)
          </button>
          <button 
            className={`tab-btn ${activeTab === "normal" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("normal")}
            style={{ padding: '15px 30px', background: 'transparent', border: 'none', color: activeTab === 'normal' ? '#fff' : '#888', borderBottom: activeTab === 'normal' ? '3px solid #28a745' : 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}
          >
            Normal Pass (General)
          </button>
          <button 
            className={`tab-btn ${activeTab === "emergency" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("emergency")}
            style={{ padding: '15px 30px', background: 'transparent', border: 'none', color: activeTab === 'emergency' ? '#fff' : '#888', borderBottom: activeTab === 'emergency' ? '3px solid #dc3545' : 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}
          >
            Emergency Pass
          </button>
        </div>

        {/* DATA TABLE */}
        {loading ? (
          <div style={{ color: '#ccc', padding: '40px', textAlign: 'center' }}>Loading pass data...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="premium-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Pass ID</th>
                  <th>Student Info</th>
                  <th>Reg No</th>
                  <th>Dept</th>
                  <th>Year</th>
                  <th>Place Purpose</th>
                  <th>Exp In</th>
                  <th>Actual In</th>
                  <th>Status</th>
                  <th>Late</th>
                  <th colSpan="2">Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedList && displayedList.length > 0 ? (
                  displayedList.reverse().map((pass) => (
                     <tr key={pass._id}>
                      <td style={{ color: '#007bff', fontWeight: 'bold' }}>{pass.PassId || "0"}</td>
                      <td><strong>{pass.StudentId?.Name || "--"}</strong></td>
                      <td style={{ opacity: 0.7 }}>{pass.StudentId?.RegisterNumber || "N/A"}</td>
                      <td style={{ fontSize: '0.85rem' }}>{pass.StudentId?.DepartmentId?.DepartmentName || "N/A"}</td>
                      <td style={{ fontWeight: 'bold' }}>{calculateYear(pass.StudentId?.StartYear)}</td>
                      <td>
                        <div style={{ fontWeight: '500' }}>{pass.Place}</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{pass.Purpose}</div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{pass.ExpectedInDateTime ? new Date(pass.ExpectedInDateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : (pass.InDateTime ? new Date(pass.InDateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : "N/A")}</td>
                      <td style={{ fontSize: '0.85rem', color: pass.LateEntry ? '#dc3545' : '#28a745' }}>{pass.ActualInDateTime ? new Date(pass.ActualInDateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : "---"}</td>
                      <td>
                        <span style={{
                          color: pass.Status === "IN" ? '#007bff' : '#28a745',
                          fontWeight: 'bold',
                          padding: '4px 10px',
                          border: `1px solid ${pass.Status === "IN" ? '#007bff' : '#28a745'}`,
                          borderRadius: '20px',
                          backgroundColor: pass.Status === "IN" ? 'rgba(0,123,255,0.1)' : 'rgba(40,167,69,0.1)',
                          fontSize: '0.8rem'
                        }}>{pass.Status || "OUT"}</span>
                      </td>
                      <td>
                         {pass.LateEntry ? <span style={{ color: '#dc3545', fontWeight: 'bold' }}>YES</span> : <span style={{ color: 'rgba(255,255,255,0.1)' }}>NO</span>}
                      </td>
                      <td>
                         <span style={{ color: (pass.approved === "YES" || pass.Approved === "YES") ? "#28a745" : (pass.approved === "CANCELL" || pass.Approved === "CANCELL") ? "#dc3545" : "#ffc107", fontWeight: "bold" }}>
                            {(pass.approved === "YES" || pass.Approved === "YES") ? "Approved" : (pass.approved === "CANCELL" || pass.Approved === "CANCELL") ? "Rejected" : "Pending"}
                         </span>
                      </td>
                      <td>
                        {(pass.approved !== "YES" && pass.Approved !== "YES" && pass.approved !== "CANCELL" && pass.Approved !== "CANCELL") ? (
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                              onClick={() => handleApprove(pass, activeTab)} 
                              style={{ background: '#28a745', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleReject(pass, activeTab)} 
                              style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: '#888' }}>Action Taken</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13" style={{ textAlign: 'center', opacity: 0.5 }}>No passes recorded in this category.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
