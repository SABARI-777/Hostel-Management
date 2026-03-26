import { useState, useEffect } from "react";
import { getCaretakerDashboardStats } from "../../api/caretaker";

export default function CaretakerOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getCaretakerDashboardStats(user._id);
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user._id]);

  const totalLateEntries = stats?.students?.list ? stats.students.list.reduce((acc, s) => acc + (s.LateEntryCount || 0), 0) : 0;

  if (loading) return <div className="glass-card">Loading Dashboard Data...</div>;
  
  if (stats?.isInactive) {
    return (
      <div className="caretaker-overview animate-up">
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed #f87171' }}>
          <h2 style={{ color: '#f87171', fontSize: '2rem' }}>Account Deactivated</h2>
          <p style={{ maxWidth: '500px', margin: '20px auto', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
            {stats.message || "Your account has been deactivated by the Administrator. You no longer have access to hostel block details, student records, or attendance logs."}
          </p>
          <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', display: 'inline-block' }}>
             <p style={{ margin: 0, fontWeight: '600' }}>Caretaker: {stats.profile.Name}</p>
             <p style={{ margin: '5px 0 0', opacity: 0.6 }}>Assigned Block: {stats.profile.Block}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return <div className="glass-card">Error loading dashboard stats.</div>;

  return (
    <div className="caretaker-overview animate-up">
      <header style={{ marginBottom: '40px' }}>
        <h2 style={{ margin: 0, fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-1px' }}>
          Block <span style={{ color: '#818cf8' }}>{stats.profile.Block}</span> Overview
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', margin: '8px 0 0', fontSize: '1.1rem' }}>
          Current status and overview of your assigned block.
        </p>
      </header>

      <div className="stats-grid">
        <div className="stat-item glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="stat-label">Students</span>
              <span className="stat-value">{stats.students.total}</span>
            </div>
            <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '14px', color: '#6366f1' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
          </div>
          <div style={{ marginTop: '15px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)' }}>
            Across {stats.infrastructure.totalRooms} managed rooms
          </div>
        </div>

        <div className="stat-item glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="stat-label">Room Occupancy</span>
              <span className="stat-value">{Math.round((stats.infrastructure.totalOccupancy/stats.infrastructure.totalCapacity)*100)}%</span>
            </div>
            <div style={{ padding: '12px', background: 'rgba(129, 140, 248, 0.1)', borderRadius: '14px', color: '#818cf8' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
          </div>
          <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${(stats.infrastructure.totalOccupancy/stats.infrastructure.totalCapacity)*100}%`, height: '100%', background: '#818cf8' }}></div>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{stats.infrastructure.totalOccupancy}/{stats.infrastructure.totalCapacity}</span>
          </div>
        </div>

        <div className="stat-item glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="stat-label">Pending Passes</span>
              <span className="stat-value" style={{ color: stats.passes.pending > 0 ? '#fbbf24' : '#fff' }}>{stats.passes.pending}</span>
            </div>
            <div style={{ padding: '12px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '14px', color: '#fbbf24' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
          </div>
          <div style={{ marginTop: '15px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)' }}>
            Requires immediate review
          </div>
        </div>

        <div className="stat-item glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="stat-label">Late Entries</span>
              <span className="stat-value" style={{ color: totalLateEntries > 5 ? '#f87171' : '#fff' }}>{totalLateEntries}</span>
            </div>
            <div style={{ padding: '12px', background: 'rgba(248, 113, 113, 0.1)', borderRadius: '14px', color: '#f87171' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
          </div>
          <div style={{ marginTop: '15px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)' }}>
            Cumulative across block
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '30px' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700' }}>Student Status</h3>
            <span style={{ fontSize: '0.8rem', padding: '6px 14px', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', borderRadius: '100px', fontWeight: '700' }}>Live Data</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
             {Object.entries(stats.students.status).map(([key, val]) => {
                const percentage = Math.round((val / stats.students.total) * 100) || 0;
                let color = '#818cf8';
                if (key === 'ACTIVE') color = '#10b981';
                else if (key === 'INACTIVE') color = '#ef4444';
                
                return (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }}></div>
                          <span style={{ fontWeight: '600', fontSize: '1rem', color: 'rgba(255,255,255,0.8)' }}>{key}</span>
                       </div>
                       <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>{val} Students ({percentage}%)</span>
                    </div>
                    <div style={{ height: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', overflow: 'hidden' }}>
                       <div style={{ width: `${percentage}%`, height: '100%', background: color, borderRadius: '10px', boxShadow: `0 0 15px ${color}44` }}></div>
                    </div>
                  </div>
                );
             })}
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', marginBottom: '30px' }}>Pass Status</h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '30px' }}>
             <div style={{ padding: '25px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), transparent)', borderRadius: '24px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                <div style={{ fontSize: '0.8rem', color: 'rgba(16, 185, 129, 0.8)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Success Rate</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: '800', lineHeight: 1 }}>{stats.passes.approved}</span>
                  <span style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.3)', marginBottom: '5px' }}>Approved</span>
                </div>
             </div>

             <div style={{ padding: '25px', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), transparent)', borderRadius: '24px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                <div style={{ fontSize: '0.8rem', color: 'rgba(239, 68, 68, 0.8)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Rejection Rate</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: '800', lineHeight: 1 }}>{stats.passes.cancelled}</span>
                  <span style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.3)', marginBottom: '5px' }}>Rejected</span>
                </div>
             </div>

             <div style={{ marginTop: 'auto', padding: '20px', background: 'rgba(129, 140, 248, 0.05)', borderRadius: '20px', border: '1px dashed rgba(129, 140, 248, 0.2)', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>
                  Monitoring <strong>{stats.infrastructure.totalRooms}</strong> rooms in <strong>Block {stats.profile.Block}</strong>. Keep up the great work!
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
