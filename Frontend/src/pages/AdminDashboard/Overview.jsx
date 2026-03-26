import { useState, useEffect } from "react";
import "./AdminDashboard.css";

const API = "http://localhost:3000";

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API}/Admin/stats/overview`);
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Failed to load statistics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return <div style={{ color: "white", padding: "40px" }}>Loading Dashboard Details...</div>;
  }

  const { studentData, departmentData, placementData, hostelData, caretakerData, advisorData, attendanceData, placementAttendanceData } = stats;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', paddingBottom: '50px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: "white", margin: "0", fontSize: '2.2rem' }}>Hostel Overview</h2>
        <button className="dash-btn" onClick={() => window.print()} style={{ height: 'auto', padding: '10px 20px' }}>Print Records</button>
      </div>
      
      {/* 1. STUDENT METRICS */}
      <div className="dashboard-card" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
          <h3 style={{ margin: 0, border: 'none', padding: 0 }}>1. Student Details</h3>
          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>
            Total Population: <strong>{studentData.total}</strong>
          </span>
        </div>

        <div style={{ marginTop: '25px' }}>
          <h4 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Status Details</h4>
          <div className="stat-card-grid">
            {Object.keys(studentData.status || {}).sort().map(k => (
              <div key={`status-card-${k}`} className="mini-stat-card" style={{ borderLeftWidth: '4px', borderLeftColor: k === 'REGULAR' ? '#28a745' : '#ffc107' }}>
                <span className="label">{k} Residents</span>
                <span className="value">{studentData.status[k]}</span>
                <div className="compliance-bar-bg" style={{ height: '4px', marginTop: '10px' }}>
                  <div className="compliance-fill" style={{ width: `${(studentData.status[k] / studentData.total) * 100}%`, background: k === 'REGULAR' ? '#28a745' : '#ffc107' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h4 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Yearly Breakdown</h4>
          <div className="stat-card-grid">
            {Object.keys(studentData.yearBreakdown || {}).map(y => (
              <div key={`year-card-${y}`} className="mini-stat-card" style={{ borderLeft: '4px solid #60a5fa' }}>
                <span className="label">{y}</span>
                <span className="value">{studentData.yearBreakdown[y]}</span>
                <div className="compliance-bar-bg" style={{ height: '4px', marginTop: '10px' }}>
                  <div className="compliance-fill" style={{ width: `${(studentData.yearBreakdown[y] / studentData.total) * 100}%`, background: '#60a5fa' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '30px' }}>
          <div>
            <h4 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Gender Distribution</h4>
            <div style={{ display: 'flex', gap: '15px' }}>
              {Object.keys(studentData.gender || {}).sort().map(k => (
                <div key={`gender-card-${k}`} style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '5px' }}>{k}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{studentData.gender[k]}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mini-stat-card absent" style={{ background: 'rgba(239, 68, 68, 0.05)', borderLeft: '4px solid #ef4444' }}>
            <span className="label" style={{ color: '#fca5a5' }}>Discipline Violations</span>
            <span className="value">{studentData.totalLateEntries || 0}</span>
            <span className="sub-label">Total Late Entry Instances</span>
          </div>
        </div>
      </div>

      {/* 2. INFRASTRUCTURE & HOSTEL METRICS */}
      <div className="dashboard-card" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
        <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>2. Hostel Facilities</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div className="mini-stat-card" style={{ borderLeft: '4px solid #007bff' }}>
            <span className="label">Total Capacity</span>
            <span className="value">{hostelData.totalCapacity}</span>
            <span className="sub-label">Beds Installed</span>
          </div>
          <div className="mini-stat-card present">
            <span className="label">Occupied</span>
            <span className="value">{hostelData.totalOccupancy}</span>
            <span className="sub-label">Current Residents</span>
          </div>
          <div className="mini-stat-card absent">
            <span className="label">Vacant</span>
            <span className="value">{hostelData.totalVacant}</span>
            <span className="sub-label">Available Beds</span>
          </div>
        </div>

        <div className="block-card-grid">
          {Object.keys(hostelData.blocks || {}).sort().map(b => {
             const block = hostelData.blocks[b];
             const occupancyRate = Math.round((block.occupancy / (block.capacity || 1)) * 100);
             return (
              <div key={`block-card-${b}`} className="block-card">
                <div className="block-card-header">
                  <span className="block-name">Block {b}</span>
                  <span className="status-badge" style={{ background: occupancyRate > 90 ? 'rgba(220,53,69,0.1)' : 'rgba(40,167,69,0.1)', color: occupancyRate > 90 ? '#dc3545' : '#28a745' }}>
                    {occupancyRate > 90 ? 'Near Capacity' : 'Available'}
                  </span>
                </div>
                <div className="block-meta">
                  <span>Room Count: <strong>{block.roomCount}</strong></span>
                  <span>Occupancy: <strong>{occupancyRate}%</strong></span>
                </div>
                <div className="compliance-bar-bg" style={{ height: '8px' }}>
                  <div className="compliance-fill" style={{ width: `${occupancyRate}%`, background: occupancyRate > 90 ? '#dc3545' : '#28a745' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                  <span>{block.occupancy} Taken</span>
                  <span>{block.vacant} Vacant</span>
                </div>
              </div>
             );
          })}
        </div>
      </div>

      {/* 3. STAFF METRICS (CARETAKERS & ADVISORS) */}
      <div className="dashboard-card" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
        <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>3. Staff Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginTop: '20px' }}>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '0.9rem', textTransform: 'uppercase' }}>Caretakers</h4>
              <span className="status-badge present">{caretakerData.total} Active</span>
            </div>
            <div className="stat-card-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="mini-stat-card present">
                <span className="label">On Duty</span>
                <span className="value">{caretakerData.status["ACTIVE"] || 0}</span>
              </div>
              <div className="mini-stat-card absent">
                <span className="label">Off Duty</span>
                <span className="value">{caretakerData.status["INACTIVE"] || 0}</span>
              </div>
            </div>
            
            <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px' }}>
              <h5 style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Deployment by Block</h5>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {Object.keys(caretakerData.byBlock || {}).sort().map(b => (
                  <div key={`ct-chip-${b}`} style={{ background: 'rgba(255,255,255,0.05)', padding: '5px 12px', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                    Block {b}: <strong>{caretakerData.byBlock[b]}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '0.9rem', textTransform: 'uppercase' }}>Advisors</h4>
              <span className="status-badge" style={{ borderColor: 'rgba(0,123,255,0.3)', color: '#007bff' }}>{advisorData.total} Members</span>
            </div>
            <div className="stat-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
              {Object.keys(advisorData.byDesignation || {}).sort().map(d => (
                <div key={`adv-card-${d}`} className="mini-stat-card" style={{ borderLeft: '4px solid #007bff' }}>
                  <span className="label" style={{ fontSize: '0.7rem' }}>{d}</span>
                  <span className="value" style={{ fontSize: '1.4rem' }}>{advisorData.byDesignation[d]}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 4. ACADEMIC DEPARTMENTS */}
      <div className="dashboard-card" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
          <h3 style={{ margin: 0, border: 'none', padding: 0 }}>4. Department Details</h3>
          <span style={{ background: 'rgba(0,123,255,0.1)', color: '#007bff', padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem', border: '1px solid rgba(0,123,255,0.2)' }}>
            Departments: <strong>{Object.keys(departmentData.studentBreakdown || {}).length}</strong>
          </span>
        </div>
        
        <div style={{ marginTop: '25px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {Object.keys(departmentData.studentBreakdown || {}).sort().map(d => {
            const count = departmentData.studentBreakdown[d];
            const percentage = Math.round((count / departmentData.total) * 100);
            return (
              <div key={`dept-card-${d}`} style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>{d}</span>
                  <span style={{ color: '#007bff' }}>{count?.total || 0} Students</span>
                </div>
                <div className="compliance-bar-bg" style={{ height: '6px', marginBottom: '15px' }}>
                  <div className="compliance-fill" style={{ width: `${Math.round(((count?.total || 0) / (departmentData.total || 1)) * 100)}%`, background: '#007bff' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {Object.entries(count)
                    .filter(([key]) => key !== 'total' && count[key] > 0)
                    .map(([year, c]) => (
                      <span key={year} style={{ fontSize: '0.7rem', opacity: 0.6, background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                        {year.charAt(0)}: {c}
                      </span>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. STUDENT PLACEMENTS */}
      <div className="dashboard-card" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
          <h3 style={{ margin: 0, border: 'none', padding: 0 }}>5. Placement Details</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span className="status-badge" style={{ borderColor: 'rgba(40,167,69,0.3)', color: '#28a745' }}>{placementData.totalBatches} Batches</span>
            <span className="status-badge" style={{ borderColor: 'rgba(0,123,255,0.3)', color: '#007bff' }}>{Object.values(placementData.studentBreakdown || {}).reduce((a, b) => a + b, 0)} Trainees</span>
          </div>
        </div>
        
        <div style={{ marginTop: '25px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {Object.keys(placementData.studentBreakdown || {}).sort().map(b => {
             const count = placementData.studentBreakdown[b];
             return (
              <div key={`batch-card-${b}`} className="mini-stat-card" style={{ borderLeft: '4px solid #007bff', background: 'rgba(0,123,255,0.02)', padding: '20px' }}>
                <span className="label">Batch Profile</span>
                <span className="value">{b}</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '1.1rem', marginBottom: '10px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Active Trainees</span>
                  <span style={{ fontWeight: 'bold', color: '#007bff' }}>{count?.total || 0}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {Object.entries(count)
                    .filter(([key]) => key !== 'total' && count[key] > 0)
                    .map(([year, c]) => (
                      <span key={year} style={{ fontSize: '0.7rem', opacity: 0.6, background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                        {year.charAt(0)}: {c}
                      </span>
                    ))}
                </div>
              </div>
             );
          })}
        </div>
      </div>

      {/* 6. ATTENDANCE HISTORICAL LOGS */}
      <div className="dashboard-card" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
          <h3 style={{ margin: 0, border: 'none', padding: 0 }}>6. Attendance Logs</h3>
          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>
            Total Logs: <strong>{attendanceData.totalLogs}</strong>
          </span>
        </div>
        
        <div className="stat-card-grid">
          <div className="mini-stat-card present">
            <span className="label">Present</span>
            <span className="value">{attendanceData.present}</span>
            <span className="sub-label">Valid signatures logged</span>
          </div>
          <div className="mini-stat-card absent">
            <span className="label">Absent</span>
            <span className="value">{attendanceData.absent}</span>
            <span className="sub-label">Absence detected</span>
          </div>
          <div className="mini-stat-card late">
            <span className="label">Late Entries</span>
            <span className="value">{attendanceData.late}</span>
            <span className="sub-label">Delayed signatures</span>
          </div>
          <div className="mini-stat-card leave">
            <span className="label">Approved Leave</span>
            <span className="value">{attendanceData.leave}</span>
            <span className="sub-label">Authorized absence</span>
          </div>
        </div>

        <div className="compliance-container">
          <div className="compliance-header">
            <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Attendance Compliance Rate</span>
            <span style={{ fontWeight: 'bold', color: '#28a745' }}>
              {Math.round((attendanceData.present / (attendanceData.present + attendanceData.absent || 1)) * 100)}%
            </span>
          </div>
          <div className="compliance-bar-bg">
            <div 
              className="compliance-fill" 
              style={{ 
                width: `${(attendanceData.present / (attendanceData.present + attendanceData.absent || 1)) * 100}%`,
                background: 'linear-gradient(90deg, #28a745, #85e085)'
              }} 
            />
            <div 
              className="compliance-fill" 
              style={{ 
                width: `${(attendanceData.absent / (attendanceData.present + attendanceData.absent || 1)) * 100}%`,
                background: 'linear-gradient(90deg, #dc3545, #ff6b6b)'
              }} 
            />
          </div>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h4 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Daily Activity Breakdown</h4>
          <table className="premium-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status Visualization</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Health</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(attendanceData.dailyBreakdown || {}).sort((a,b) => new Date(b) - new Date(a)).map(date => {
                const dayPresent = attendanceData.dailyBreakdown[date].present;
                const dayAbsent = attendanceData.dailyBreakdown[date].absent;
                const ratio = Math.round((dayPresent / (dayPresent + dayAbsent || 1)) * 100);
                return (
                  <tr key={`att-day-${date}`}>
                    <td><strong>{date}</strong></td>
                    <td style={{ width: '150px' }}>
                      <div className="compliance-bar-bg" style={{ height: '6px', marginTop: '0' }}>
                        <div className="compliance-fill" style={{ width: `${ratio}%`, background: '#28a745' }} />
                      </div>
                    </td>
                    <td><span className="status-badge present">{dayPresent}</span></td>
                    <td><span className="status-badge absent">{dayAbsent}</span></td>
                    <td style={{ color: ratio > 80 ? '#28a745' : ratio > 50 ? '#ffc107' : '#dc3545', fontWeight: 'bold' }}>{ratio}%</td>
                  </tr>
                );
              })}
              {Object.keys(attendanceData.dailyBreakdown || {}).length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: "center", opacity: 0.5 }}>No daily records available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. PLACEMENT ATTENDANCE HISTORICAL LOGS */}
      <div className="dashboard-card" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
          <h3 style={{ margin: 0, border: 'none', padding: 0 }}>7. Placement Attendance</h3>
          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>
            Total Logs: <strong>{placementAttendanceData?.totalLogs || 0}</strong>
          </span>
        </div>
        
        <div className="stat-card-grid">
          <div className="mini-stat-card present">
            <span className="label">Verified Present</span>
            <span className="value">{placementAttendanceData?.present || 0}</span>
            <span className="sub-label">Valid signatures logged</span>
          </div>
          <div className="mini-stat-card absent">
            <span className="label">Violations</span>
            <span className="value">{placementAttendanceData?.absent || 0}</span>
            <span className="sub-label">Absence detected</span>
          </div>
          <div className="mini-stat-card late">
            <span className="label">Late Entries</span>
            <span className="value">{placementAttendanceData?.late || 0}</span>
            <span className="sub-label">Delayed signatures</span>
          </div>
          <div className="mini-stat-card leave">
            <span className="label">Approved Leave</span>
            <span className="value">{placementAttendanceData?.leave || 0}</span>
            <span className="sub-label">Authorized absence</span>
          </div>
        </div>

        <div className="compliance-container">
          <div className="compliance-header">
            <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Placement Compliance Rate</span>
            <span style={{ fontWeight: 'bold', color: '#007bff' }}>
              {Math.round((placementAttendanceData?.present / (placementAttendanceData?.present + placementAttendanceData?.absent || 1)) * 100 || 0)}%
            </span>
          </div>
          <div className="compliance-bar-bg">
            <div 
              className="compliance-fill" 
              style={{ 
                width: `${(placementAttendanceData?.present / (placementAttendanceData?.present + placementAttendanceData?.absent || 1)) * 100 || 0}%`,
                background: 'linear-gradient(90deg, #007bff, #3399ff)'
              }} 
            />
            <div 
              className="compliance-fill" 
              style={{ 
                width: `${(placementAttendanceData?.absent / (placementAttendanceData?.present + placementAttendanceData?.absent || 1)) * 100 || 0}%`,
                background: 'linear-gradient(90deg, #dc3545, #ff6b6b)'
              }} 
            />
          </div>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h4 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Daily Placement Activity</h4>
          <table className="premium-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status Visualization</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Health</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(placementAttendanceData?.dailyBreakdown || {}).sort((a,b) => new Date(b) - new Date(a)).map(date => {
                const dayPresent = placementAttendanceData.dailyBreakdown[date].present;
                const dayAbsent = placementAttendanceData.dailyBreakdown[date].absent;
                const ratio = Math.round((dayPresent / (dayPresent + dayAbsent || 1)) * 100);
                return (
                  <tr key={`patt-day-${date}`}>
                    <td><strong>{date}</strong></td>
                    <td style={{ width: '150px' }}>
                      <div className="compliance-bar-bg" style={{ height: '6px', marginTop: '0' }}>
                        <div className="compliance-fill" style={{ width: `${ratio}%`, background: '#007bff' }} />
                      </div>
                    </td>
                    <td><span className="status-badge present" style={{ borderColor: 'rgba(0,123,255,0.3)', color: '#007bff', background: 'rgba(0,123,255,0.1)' }}>{dayPresent}</span></td>
                    <td><span className="status-badge absent">{dayAbsent}</span></td>
                    <td style={{ color: ratio > 80 ? '#007bff' : ratio > 50 ? '#ffc107' : '#dc3545', fontWeight: 'bold' }}>{ratio}%</td>
                  </tr>
                );
              })}
              {Object.keys(placementAttendanceData?.dailyBreakdown || {}).length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: "center", opacity: 0.5 }}>No daily placement records available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
