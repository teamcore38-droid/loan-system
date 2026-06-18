const fs = require('fs');
const http = require('http');
const puppeteer = require('puppeteer');

const users = [
  { username: 'admin', role: 'Super Admin' },
  { username: 'remedial', role: 'Remedial Officer' },
  { username: 'credit', role: 'Credit Officer' },
  { username: 'sales', role: 'Sales Officer' },
  { username: 'ccpu', role: 'CCPU User' },
  { username: 'risk', role: 'Risk & Compliance' }
];

// Pages accessible by role (from Sidebar.jsx)
const pagesByRole = {
  'Super Admin': ['dashboard', 'cases', 'restructure', 'approvals', 'monitoring', 'reports', 'audit', 'users', 'settings'],
  'Remedial Officer': ['dashboard', 'cases', 'restructure', 'monitoring', 'settings'],
  'Credit Officer': ['dashboard', 'cases', 'approvals', 'settings'],
  'Sales Officer': ['dashboard', 'cases', 'restructure', 'settings'],
  'CCPU User': ['dashboard', 'cases', 'settings'],
  'Risk & Compliance': ['dashboard', 'cases', 'monitoring', 'reports', 'audit', 'settings']
};

const pageNames = {
  'dashboard': '01_dashboard',
  'cases': '02_cases_list',
  'restructure': '03_restructure_requests',
  'approvals': '04_approvals_queue',
  'monitoring': '05_monitoring',
  'reports': '06_reports',
  'audit': '07_audit_logs',
  'users': '08_user_management',
  'settings': '09_settings'
};

const pageLabels = {
  'dashboard': 'Dashboard',
  'cases': 'Cases',
  'restructure': 'Restructure',
  'approvals': 'Approvals',
  'monitoring': 'Monitoring',
  'reports': 'Reports',
  'audit': 'Audit',
  'users': 'User',
  'settings': 'Settings'
};

const base = process.env.BASE_URL || 'http://localhost:5173';
const apiBase = process.env.API_URL || 'http://localhost:8080/api';
const outDir = `${__dirname}/../../screenshots/auth`;

function waitFor(url, timeout = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    (function check() {
      const req = http.get(url, res => {
        res.destroy();
        resolve();
      });
      req.on('error', () => {
        if (Date.now() - start > timeout) return reject(new Error('timeout'));
        setTimeout(check, 500);
      });
    })();
  });
}

(async () => {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  try {
    await waitFor(base, 30000);
  } catch (e) {
    console.warn('Frontend not responding');
  }

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], defaultViewport: { width: 1280, height: 900 } });
  const page = await browser.newPage();

  for (const u of users) {
    try {
      console.log('Authenticating', u.username);
      
      // Navigate to app on correct origin
      await page.goto(base, { waitUntil: 'networkidle2', timeout: 20000 });

      let token = 'dev-fallback-token';
      let userObj = {
        username: u.username,
        name: u.username,
        role: u.role,
        employeeId: null,
        branch: null,
        status: 'Active',
        permissions: []
      };

      try {
        const loginRes = await page.evaluate(async (apiBase, username, password, role) => {
          try {
            const res = await fetch(`${apiBase}/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password, role })
            });
            const data = await res.json();
            return { ok: res.ok, data };
          } catch (e) {
            return { ok: false, data: null };
          }
        }, apiBase, u.username, 'password', u.role);

        if (loginRes && loginRes.ok && loginRes.data && loginRes.data.token) {
          token = loginRes.data.token;
          userObj = {
            username: loginRes.data.username,
            name: loginRes.data.name,
            role: loginRes.data.role,
            employeeId: loginRes.data.employeeId,
            branch: loginRes.data.branch,
            status: loginRes.data.status,
            permissions: loginRes.data.permissions ? loginRes.data.permissions.split(', ') : []
          };
          console.log('API login successful for', u.username);
        } else {
          console.warn('API login unavailable; using local user for', u.username);
        }
      } catch (e) {
        console.warn('API login error for', u.username);
      }

      // Set sessionStorage
      await page.evaluate((token, userJson) => {
        sessionStorage.setItem('cf_token', token);
        sessionStorage.setItem('cf_current_user', userJson);
      }, token, JSON.stringify(userObj));

      // Reload to pick up session
      await page.reload({ waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Capture pages available for this role
      const pages = pagesByRole[u.role] || [];

      for (const pageId of pages) {
        try {
          console.log(`Navigating ${u.username} to ${pageId}`);

          // Click sidebar button for this page
          await page.evaluate((label) => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => b.textContent.includes(label));
            if (btn) btn.click();
          }, pageLabels[pageId]);

          // Wait for page to render
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Take screenshot
          const filename = `${u.username}_${pageNames[pageId]}.png`;
          await page.screenshot({ path: `${outDir}/${filename}`, fullPage: true });
          console.log('Saved', filename);
        } catch (err) {
          console.error('Failed to capture', pageId, 'for', u.username, err.message);
        }
      }

    } catch (err) {
      console.error('Error for user', u.username, err.message);
    }
  }

  await browser.close();
  console.log('Auth screenshots complete');
})();
