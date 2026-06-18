import React, { useState, useEffect } from 'react';
import { UserPlus, Search, UserCheck, Shield, Edit, ShieldAlert } from 'lucide-react';
import { api } from '../utils/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Form State
  const [editingUser, setEditingUser] = useState(null);
  const [fullName, setFullName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [userRole, setUserRole] = useState('Remedial Officer');
  const [branch, setBranch] = useState('Colombo Main Branch');
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const list = await api.getUsers();
    setUsers(list);
  };

  // Metrics
  const totalUsers = users.length;
  const activeCount = users.filter(u => u.status === 'Active').length;
  const inactiveCount = users.filter(u => u.status === 'Inactive').length;
  const lockedCount = users.filter(u => u.status === 'Locked').length;
  const pendingCount = users.filter(u => u.status === 'Pending').length || 0;

  const handleEdit = (user) => {
    setEditingUser(user);
    setFullName(user.name);
    setEmployeeId(user.employeeId);
    setEmail(user.email || `${user.username}@bank.lk`);
    setContactNumber(user.contact || '+94 77 000 0000');
    setUserRole(user.role);
    setBranch(user.branch);
    
    // Parse permissions (comma separated string in DB to array)
    const perms = user.permissions 
      ? (typeof user.permissions === 'string' ? user.permissions.split(', ') : user.permissions)
      : [];
    setPermissions(perms);
  };

  const handleAddNew = () => {
    setEditingUser({ isNew: true });
    setFullName('');
    setEmployeeId(`EMP-00${users.length + 12}`);
    setEmail('');
    setContactNumber('');
    setUserRole('Remedial Officer');
    setBranch('Colombo Main Branch');
    setPermissions([]);
  };

  const handlePermissionToggle = (perm) => {
    if (permissions.includes(perm)) {
      setPermissions(permissions.filter(p => p !== perm));
    } else {
      setPermissions([...permissions, perm]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!fullName || !email) {
      alert('Please fill in required fields.');
      return;
    }

    const payload = {
      isNew: editingUser?.isNew || false,
      name: fullName,
      employeeId,
      email,
      contact: contactNumber,
      role: userRole,
      branch,
      permissions: permissions.join(', ') // Save as comma separated string in DB
    };

    const res = await api.saveUser(payload);
    if (res) {
      alert('User information saved successfully.');
      await fetchUsers();
      setEditingUser(null);
    } else {
      alert('Failed to save user profile.');
    }
  };

  const toggleStatus = async (empId) => {
    const res = await api.toggleUserStatus(empId);
    if (res) {
      await fetchUsers();
    } else {
      alert('Status modification failed.');
    }
  };

  // Filtered List
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'All' || u.role === selectedRole;
    const matchesStatus = selectedStatus === 'All' || u.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '9fr 4fr', gap: '20px', height: '100%' }}>
      {/* Left Column: Users Grid & Metrics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
        
        {/* Filters Panel */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search users, roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input"
              style={{ width: '100%', paddingLeft: '38px', fontSize: '0.85rem' }}
            />
          </div>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="glass-input"
            style={{ width: '150px', fontSize: '0.85rem' }}
          >
            <option value="All">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Remedial Officer">Remedial Officer</option>
            <option value="Credit Officer">Credit Officer</option>
            <option value="Sales Officer">Sales Officer</option>
            <option value="CCPU User">CCPU User</option>
            <option value="Risk & Compliance">Risk & Compliance</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="glass-input"
            style={{ width: '150px', fontSize: '0.85rem' }}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Locked">Locked</option>
            <option value="Pending">Pending</option>
          </select>

          <button onClick={handleAddNew} className="glass-button" style={{ display: 'flex', gap: '8px', padding: '10px 16px', fontSize: '0.85rem' }}>
            <UserPlus size={16} /> Add New User
          </button>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
          <div className="glass-panel" style={{ padding: '14px', borderLeft: '3px solid var(--color-primary)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Total Users</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '4px' }}>{totalUsers}</div>
          </div>
          <div className="glass-panel" style={{ padding: '14px', borderLeft: '3px solid var(--color-success)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Active</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '4px', color: 'var(--color-success)' }}>{activeCount}</div>
          </div>
          <div className="glass-panel" style={{ padding: '14px', borderLeft: '3px solid var(--text-muted)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Inactive</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '4px' }}>{inactiveCount}</div>
          </div>
          <div className="glass-panel" style={{ padding: '14px', borderLeft: '3px solid var(--color-danger)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Locked</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '4px', color: 'var(--color-danger)' }}>{lockedCount}</div>
          </div>
          <div className="glass-panel" style={{ padding: '14px', borderLeft: '3px solid var(--color-warning)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Pending Approval</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '4px', color: 'var(--color-warning)' }}>{pendingCount}</div>
          </div>
        </div>

        {/* Users Table */}
        <div className="glass-panel" style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '16px' }}>System Users</h3>
          <div className="table-container">
            <table className="custom-table" style={{ fontSize: '0.82rem' }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Employee ID</th>
                  <th>Role</th>
                  <th>Branch</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.employeeId}>
                    <td style={{ fontWeight: 500 }}>{u.name}</td>
                    <td>{u.employeeId}</td>
                    <td>{u.role}</td>
                    <td>{u.branch}</td>
                    <td>
                      <span className={`badge ${
                        u.status === 'Active' ? 'success' : 
                        u.status === 'Inactive' ? 'danger' : 'warning'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEdit(u)} className="glass-button-secondary" style={{ padding: '4px 8px', fontSize: '0.78rem' }}>
                          <Edit size={12} /> Edit
                        </button>
                        <button 
                          onClick={() => toggleStatus(u.employeeId)} 
                          className="glass-button-secondary" 
                          style={{ padding: '4px 8px', fontSize: '0.78rem', color: u.status === 'Active' ? 'var(--color-danger)' : 'var(--color-success)' }}
                        >
                          {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Column: Add / Edit Panel */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            {editingUser ? (editingUser.isNew ? 'Add User Account' : 'Edit User Profile') : 'Select User to Edit'}
          </h3>

          {!editingUser ? (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              textAlign: 'center',
              padding: '40px'
            }}>
              Select a user from the list to edit details, or click "Add New User" to register a new credentials set.
            </div>
          ) : (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Full Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="glass-input" style={{ fontSize: '0.85rem' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Employee ID</label>
                <input type="text" readOnly={!editingUser.isNew} value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="glass-input" style={{ fontSize: '0.85rem' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="glass-input" style={{ fontSize: '0.85rem' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Contact Number</label>
                <input type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="glass-input" style={{ fontSize: '0.85rem' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Role</label>
                <select value={userRole} onChange={(e) => setUserRole(e.target.value)} className="glass-input" style={{ fontSize: '0.85rem' }}>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Remedial Officer">Remedial Officer</option>
                  <option value="Credit Officer">Credit Officer</option>
                  <option value="Sales Officer">Sales Officer</option>
                  <option value="CCPU User">CCPU User</option>
                  <option value="Risk & Compliance">Risk & Compliance</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Branch</label>
                <select value={branch} onChange={(e) => setBranch(e.target.value)} className="glass-input" style={{ fontSize: '0.85rem' }}>
                  <option value="Colombo Main Branch">Colombo Main Branch</option>
                  <option value="Negombo Branch">Negombo Branch</option>
                  <option value="Kandy Branch">Kandy Branch</option>
                  <option value="Gampaha Branch">Gampaha Branch</option>
                  <option value="Kurunegala Branch">Kurunegala Branch</option>
                  <option value="Matara Branch">Matara Branch</option>
                </select>
              </div>

              {/* Permissions list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Account Permissions</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
                  {['Create Cases', 'Upload Documents', 'Approve Cases', 'Finalize Parameters', 'Capture Consent', 'Execute CBS Update', 'Audit Access', 'Generate Reports', 'System Settings'].map(p => (
                    <label key={p} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={permissions.includes(p)}
                        onChange={() => handlePermissionToggle(p)}
                        style={{ accentColor: 'var(--color-primary)' }}
                      />
                      <span>{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: 'auto', paddingTop: '10px' }}>
                <button onClick={() => setEditingUser(null)} className="glass-button-secondary" type="button">
                  Cancel
                </button>
                <button onClick={handleSave} className="glass-button" type="submit">
                  Save User
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
