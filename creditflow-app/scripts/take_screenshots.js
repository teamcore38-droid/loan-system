const fs = require('fs');
const http = require('http');
const puppeteer = require('puppeteer');

const urls = [
  { path: '/', file: '01_landing_page_hero.png' },
  { path: '/login', file: '05_login_page.png' },
  { path: '/register', file: '06_register_page.png' },
  { path: '/dashboard', file: '07_dashboard_super_admin_overview.png' },
];

const base = process.env.BASE_URL || 'http://localhost:5173';
const outDir = `${__dirname}/../../screenshots`;

function waitForServer(url, timeout = 30000) {
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
    await waitForServer(base, 30000);
  } catch (e) {
    console.warn('Dev server not responding at', base, '- continuing and attempts will be made to load pages');
  }

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], defaultViewport: { width: 1280, height: 900 } });
  const page = await browser.newPage();

  for (const u of urls) {
    const url = base + u.path;
    try {
      console.log('Opening', url);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
      await page.screenshot({ path: `${outDir}/${u.file}`, fullPage: true });
      console.log('Saved', u.file);
    } catch (err) {
      console.error('Failed to capture', url, err.message);
    }
  }

  await browser.close();
  console.log('Done');
})();
