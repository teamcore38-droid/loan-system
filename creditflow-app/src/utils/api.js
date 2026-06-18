// Client-side API integration layer for Spring Boot backend

const API_URL = 'http://localhost:8080/api';

const getHeaders = () => {
  const token = sessionStorage.getItem('cf_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Authentication
  async login(username, password, role) {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed.' };
      }
      sessionStorage.setItem('cf_token', data.token);
      sessionStorage.setItem('cf_current_user', JSON.stringify({
        username: data.username,
        name: data.name,
        role: data.role,
        employeeId: data.employeeId,
        branch: data.branch,
        status: data.status,
        permissions: data.permissions ? data.permissions.split(', ') : []
      }));
      return { success: true, user: data };
    } catch (e) {
      return { success: false, error: 'Cannot connect to Spring Boot backend server.' };
    }
  },

  async register(userData) {
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed.' };
      }
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Cannot connect to backend server.' };
    }
  },

  logout() {
    sessionStorage.removeItem('cf_token');
    sessionStorage.removeItem('cf_current_user');
  },

  // Loans
  async getLoanByAccount(accountNo) {
    try {
      const res = await fetch(`${API_URL}/loans/${accountNo}`, {
        headers: getHeaders()
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async createLoan(loanData) {
    try {
      const res = await fetch(`${API_URL}/loans/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(loanData)
      });
      if (!res.ok) {
        let errorMsg = 'Failed to seed loan.';
        try {
          const data = await res.json();
          errorMsg = data.error || errorMsg;
        } catch (_) {
          errorMsg = `Server error: ${res.status} ${res.statusText}`;
        }
        return { success: false, error: errorMsg };
      }
      const data = await res.json();
      return { success: true, loan: data };
    } catch (e) {
      console.error(e);
      return { success: false, error: 'Cannot connect to backend server.' };
    }
  },

  // Cases
  async getCases() {
    try {
      const res = await fetch(`${API_URL}/cases`, {
        headers: getHeaders()
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async getCaseById(id) {
    try {
      const res = await fetch(`${API_URL}/cases/${id}`, {
        headers: getHeaders()
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async createCase(caseData) {
    try {
      const user = JSON.parse(sessionStorage.getItem('cf_current_user'));
      const payload = {
        ...caseData,
        assignedOfficer: user ? user.name : 'Unassigned'
      };

      const res = await fetch(`${API_URL}/cases/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Create case failed.');
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async updateCaseStage(caseId, newStage, comment) {
    try {
      const user = JSON.parse(sessionStorage.getItem('cf_current_user'));
      const res = await fetch(`${API_URL}/cases/${caseId}/stage`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          stage: newStage,
          comment,
          author: user ? user.name : 'System'
        })
      });
      if (!res.ok) throw new Error('Stage transition failed.');
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async updateCaseDetails(caseId, updatedDetails) {
    try {
      const res = await fetch(`${API_URL}/cases/${caseId}/details`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updatedDetails)
      });
      if (!res.ok) throw new Error('Update case details failed.');
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async verifyDocuments(caseId) {
    try {
      const res = await fetch(`${API_URL}/cases/${caseId}/verify`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('AI document verification call failed.');
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async uploadCaseDocument(caseId, file) {
    try {
      const token = sessionStorage.getItem('cf_token');
      const formData = new FormData();
      formData.append('file', file);

      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/cases/${caseId}/upload`, {
        method: 'POST',
        headers,
        body: formData
      });
      if (!res.ok) throw new Error('Upload failed');
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async deleteCaseDocument(caseId, fileName) {
    try {
      const token = sessionStorage.getItem('cf_token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/cases/${caseId}/files/${fileName}`, {
        method: 'DELETE',
        headers
      });
      if (!res.ok) throw new Error('Delete failed');
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  // Users Management (Admin)
  async getUsers() {
    try {
      const res = await fetch(`${API_URL}/users/list`, {
        headers: getHeaders()
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async saveUser(userRequest) {
    try {
      const res = await fetch(`${API_URL}/users/save`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userRequest)
      });
      if (!res.ok) throw new Error('Save user profile failed.');
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async toggleUserStatus(employeeId) {
    try {
      const res = await fetch(`${API_URL}/users/toggle-status/${employeeId}`, {
        method: 'PUT',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Status modification failed.');
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  // Audit logs
  async getLogs() {
    try {
      const res = await fetch(`${API_URL}/logs/list`, {
        headers: getHeaders()
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  // NOTE: Audit records are generated authoritatively on the server. Most actions are
  // logged automatically by the backend controllers where they occur. This method only
  // forwards the semantic fields; the server assigns the id, timestamp, client IP, and
  // resolves the acting user from the authenticated session. Any id/timestamp/ip sent
  // here is ignored and overwritten server-side.
  async addLog(user, module, action, details, status = 'Success', changeDetails = null) {
    try {
      const payload = {
        user,
        module,
        action,
        details,
        status,
        changeField: changeDetails?.field || null,
        changeBefore: changeDetails?.before || null,
        changeAfter: changeDetails?.after || null,
        changeComment: changeDetails?.comment || null
      };

      const res = await fetch(`${API_URL}/logs/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Create log failed.');
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  ,

  // Reports & Analytics (computed server-side from live data)
  async getReportAnalytics({ loanType, range, branch } = {}) {
    try {
      const params = new URLSearchParams();
      if (loanType) params.append('loanType', loanType);
      if (range) params.append('range', range);
      if (branch) params.append('branch', branch);
      const res = await fetch(`${API_URL}/reports/analytics?${params.toString()}`, {
        headers: getHeaders()
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  // Streams a real CSV file from the backend and triggers a browser download.
  async exportReport({ type, loanType, range } = {}) {
    try {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (loanType) params.append('loanType', loanType);
      if (range) params.append('range', range);

      const res = await fetch(`${API_URL}/reports/export?${params.toString()}`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Report export failed.');

      const blob = await res.blob();
      const safeType = (type || 'Report').replace(/[^A-Za-z0-9]+/g, '_');
      const stamp = new Date().toISOString().slice(0, 10);
      const filename = `${safeType}_${stamp}.csv`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      return { success: true, filename };
    } catch (e) {
      console.error(e);
      return { success: false, error: 'Cannot connect to backend server.' };
    }
  }

  ,

  // System parameters (persisted server-side in system_config)
  async getConfig() {
    try {
      const res = await fetch(`${API_URL}/config`, { headers: getHeaders() });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async saveConfig(configMap) {
    try {
      const res = await fetch(`${API_URL}/config`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(configMap)
      });
      if (!res.ok) throw new Error('Save configuration failed.');
      return { success: true, config: await res.json() };
    } catch (e) {
      console.error(e);
      return { success: false, error: 'Cannot connect to backend server.' };
    }
  }
};
