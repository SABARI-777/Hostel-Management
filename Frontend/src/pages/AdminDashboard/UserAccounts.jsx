import { useState, useEffect } from "react";
import "./AdminDashboard.css";

import { API } from "../../apiConfig";

export default function UserAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editAccount, setEditAccount] = useState(null);
  const [deletePasswordConfirm, setDeletePasswordConfirm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [newAccount, setNewAccount] = useState({ Email: "", Password: "", MobileNumber: "", Type: "STUDENT" });
  const [createLoading, setCreateLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const res = await fetch(`${API}/Admin/users/u/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAccount),
      });

      const data = await res.json();
      if (res.ok) {
        alert("User account created successfully!");
        setNewAccount({ Email: "", Password: "", MobileNumber: "", Type: "STUDENT" });
        setCurrentPage(1);
        fetchAccounts();
      } else {
        alert("Creation failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Network error occurred.");
    } finally {
      setCreateLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/Admin/users/u/details`);
      const data = await res.json();
      if (res.ok) {
        setAccounts(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching accounts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/Admin/users/u/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editAccount),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Account updated successfully");
        setEditAccount(null);
        fetchAccounts();
      } else {
        alert("Error updating account: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Update request failed.");
    }
  };

  const handleDeleteCommit = async (id) => {
    if (!deletePasswordConfirm) {
      alert("You must provide the user's password to delete their account as per backend rules.");
      return;
    }

    try {
      const payload = { _id: id, Password: deletePasswordConfirm };
      const res = await fetch(`${API}/Admin/users/u/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Account deleted successfully!");
        setShowDeleteConfirm(null);
        setDeletePasswordConfirm("");
        fetchAccounts();
      } else {
        alert("Failed to delete: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Delete request failed.");
    }
  };

  const stats = {
    total: accounts.length,
    STUDENT: accounts.filter(a => a.Type === "STUDENT").length,
    CARETAKER: accounts.filter(a => a.Type === "CARETAKER").length,
    ADVISOR: accounts.filter(a => a.Type === "ADVISOR").length,
    ADMIN: accounts.filter(a => a.Type === "ADMIN").length,
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredAccounts = accounts.filter(acc => 
    searchTerm === "" || 
    acc.Email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAccounts = filteredAccounts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="dashboard-container" style={{ paddingBottom: "50px" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: "white", margin: "0", fontSize: '2.2rem' }}>System User Accounts</h2>
        <button className="dash-btn" onClick={fetchAccounts} style={{ height: 'auto', padding: '10px 20px' }}>Refresh Data</button>
      </div>

      {/* STRATEGIC ANALYTICS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '15px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '10px' }}>Total Registered Logins</div>
          <div style={{ color: '#fff', fontSize: '2.2rem', fontWeight: 'bold' }}>{stats.total}</div>
        </div>
        <div style={{ background: 'rgba(40, 167, 69, 0.1)', borderRadius: '15px', padding: '20px', border: '1px solid rgba(40,167,69,0.3)' }}>
          <div style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '10px' }}>Student Accounts</div>
          <div style={{ color: '#28a745', fontSize: '2.2rem', fontWeight: 'bold' }}>{stats.STUDENT}</div>
        </div>
        <div style={{ background: 'rgba(0, 123, 255, 0.1)', borderRadius: '15px', padding: '20px', border: '1px solid rgba(0,123,255,0.3)' }}>
          <div style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '10px' }}>Caretaker Accounts</div>
          <div style={{ color: '#007bff', fontSize: '2.2rem', fontWeight: 'bold' }}>{stats.CARETAKER}</div>
        </div>
        <div style={{ background: 'rgba(255, 193, 7, 0.1)', borderRadius: '15px', padding: '20px', border: '1px solid rgba(255,193,7,0.3)' }}>
          <div style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '10px' }}>Advisor Accounts</div>
          <div style={{ color: '#ffc107', fontSize: '2.2rem', fontWeight: 'bold' }}>{stats.ADVISOR}</div>
        </div>
        <div style={{ background: 'rgba(220, 53, 69, 0.1)', borderRadius: '15px', padding: '20px', border: '1px solid rgba(220,53,69,0.3)' }}>
          <div style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '10px' }}>Admin Accounts</div>
          <div style={{ color: '#dc3545', fontSize: '2.2rem', fontWeight: 'bold' }}>{stats.ADMIN}</div>
        </div>
      </div>

      {/* CREATE ACCOUNT FORM */}
      <div className="dashboard-card" style={{ marginBottom: "30px", background: 'rgba(255, 255, 255, 0.05)', borderRadius: '15px' }}>
        <h3 style={{ color: "white", marginTop: 0 }}>Create User Account</h3>
        <form onSubmit={handleCreateSubmit} className="dashboard-form" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              className="dash-input" 
              type="email" 
              placeholder="e.g. user@domain.com"
              value={newAccount.Email} 
              onChange={e => setNewAccount({...newAccount, Email: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Mobile Number</label>
            <input 
              className="dash-input" 
              type="text" 
              placeholder="e.g. 9876543210"
              value={newAccount.MobileNumber} 
              onChange={e => setNewAccount({...newAccount, MobileNumber: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Initial Password</label>
            <input 
              className="dash-input" 
              type="password" 
              placeholder="Min 4 characters"
              value={newAccount.Password} 
              onChange={e => setNewAccount({...newAccount, Password: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Portal Access Role</label>
            <select 
              className="dash-input" 
              value={newAccount.Type} 
              onChange={e => setNewAccount({...newAccount, Type: e.target.value})} 
              required
            >
              <option value="STUDENT">STUDENT</option>
              <option value="CARETAKER">CARETAKER</option>
              <option value="ADVISOR">ADVISOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div className="form-group" style={{ display: "flex", alignItems: "flex-end" }}>
            <button type="submit" className="dash-btn" disabled={createLoading} style={{ width: "100%" }}>
              {createLoading ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>

      {/* SEARCH BAR */}
      <div className="filter-hub">
          <div className="filter-group search">
              <label className="filter-label">Search Accounts</label>
              <input 
                type="text" 
                className="filter-control" 
                placeholder="Search by Email (e.g. user@example.com)..." 
                value={searchTerm}
                onChange={handleSearchChange}
              />
          </div>
          {searchTerm && (
            <div className="filter-row">
              <button className="clear-filters-btn" onClick={() => { setSearchTerm(""); setCurrentPage(1); }}>RESET</button>
            </div>
          )}
      </div>

      <div className="dashboard-card" style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '15px' }}>
        {loading ? (
          <div style={{ color: '#ccc', padding: '40px', textAlign: 'center' }}>Loading user accounts...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="premium-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Role Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAccounts && paginatedAccounts.length > 0 ? (
                  paginatedAccounts.map((acc) => (
                    <tr key={acc._id}>
                      <td><strong>{acc.Email}</strong></td>
                      <td>{acc.MobileNumber}</td>
                      <td><span style={{ padding: '3px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.85rem' }}>{acc.Type}</span></td>
                      <td>
                        <button 
                          onClick={() => setEditAccount(acc)}
                          style={{ background: '#007bff', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginRight: '10px' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => setShowDeleteConfirm(acc._id === showDeleteConfirm ? null : acc._id)}
                          style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          {showDeleteConfirm === acc._id ? "Cancel" : "Delete"}
                        </button>

                        {showDeleteConfirm === acc._id && (
                          <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                            <input 
                              type="password" 
                              placeholder="User's Password" 
                              value={deletePasswordConfirm} 
                              onChange={(e) => setDeletePasswordConfirm(e.target.value)} 
                              style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                            <button 
                              onClick={() => handleDeleteCommit(acc._id)}
                              style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                              Confirm Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', opacity: 0.5 }}>No accounts found in system.</td>
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
        )}
      </div>

      {editAccount && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: '#1a1a2e', padding: '30px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', width: '400px' }}>
            <h3 style={{ color: 'white', marginTop: 0 }}>Edit User Account</h3>
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                type="email" 
                required 
                value={editAccount.Email} 
                onChange={(e) => setEditAccount({...editAccount, Email: e.target.value})} 
                className="form-input" 
                placeholder="Email"
                style={{ padding: '10px', borderRadius: '5px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white' }}
              />
              <input 
                type="text" 
                required 
                value={editAccount.MobileNumber} 
                onChange={(e) => setEditAccount({...editAccount, MobileNumber: e.target.value})} 
                className="form-input" 
                placeholder="Mobile Number"
                style={{ padding: '10px', borderRadius: '5px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white' }}
              />
              <input 
                type="password" 
                required 
                value={editAccount.Password} 
                onChange={(e) => setEditAccount({...editAccount, Password: e.target.value})} 
                className="form-input" 
                placeholder="Password"
                style={{ padding: '10px', borderRadius: '5px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white' }}
              />
              <select 
                value={editAccount.Type} 
                onChange={(e) => setEditAccount({...editAccount, Type: e.target.value})} 
                className="form-select"
                style={{ padding: '10px', borderRadius: '5px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white' }}
              >
                <option value="STUDENT" style={{ color: 'black' }}>STUDENT</option>
                <option value="CARETAKER" style={{ color: 'black' }}>CARETAKER</option>
                <option value="ADVISOR" style={{ color: 'black' }}>ADVISOR</option>
                <option value="ADMIN" style={{ color: 'black' }}>ADMIN</option>
              </select>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Save Changes</button>
                <button type="button" onClick={() => setEditAccount(null)} style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
