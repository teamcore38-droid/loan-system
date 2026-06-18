/**
 * CreditFlow - Comprehensive Screenshot Automation (v3 FINAL)
 * Uses verified CSS selectors from Sidebar.jsx and component analysis.
 */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const FRONTEND_URL = 'http://localhost:5173';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const USERS = {
  admin:    { username: 'admin',    password: 'password', role: 'Super Admin' },
  remedial: { username: 'remedial', password: 'password', role: 'Remedial Officer' },
  credit:   { username: 'credit',   password: 'password', role: 'Credit Officer' },
  sales:    { username: 'sales',    password: 'password', role: 'Sales Officer' },
  ccpu:     { username: 'ccpu',     password: 'password', role: 'CCPU User' },
  risk:     { username: 'risk',     password: 'password', role: 'Risk & Compliance' }
};

let screenshotCounter = 0;
let browser, page;

async function screenshot(name) {
  screenshotCounter++;
  const num = String(screenshotCounter).padStart(2, '0');
  const filename = `${num}_${name}.png`;
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, filename), fullPage: false });
  console.log(`  [${num}] ${filename}`);
}

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Login with precise selectors
async function login(user) {
  console.log(`\n  >> Login: ${user.username} (${user.role})`);
  await page.goto(FRONTEND_URL, { waitUntil: 'networkidle0', timeout: 15000 });
  await wait(1500);

  // Click "Sign In" on landing page - it's a button with text "Sign In"
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const b of btns) {
      if (b.textContent.trim() === 'Sign In') { b.click(); return; }
    }
  });
  await wait(1500);

  // Clear and fill username (the text input has class glass-input)
  await page.evaluate((username) => {
    const inputs = document.querySelectorAll('input.glass-input');
    for (const inp of inputs) {
      if (inp.type === 'text') { inp.value = ''; inp.focus(); }
    }
  }, user.username);
  const textInput = await page.$('input[type="text"].glass-input');
  if (textInput) {
    await textInput.click({ clickCount: 3 });
    await textInput.type(user.username);
  }

  // Clear and fill password
  const pwInput = await page.$('input[type="password"].glass-input');
  if (pwInput) {
    await pwInput.click({ clickCount: 3 });
    await pwInput.type(user.password);
  }

  // Select role
  const sel = await page.$('select.glass-input');
  if (sel) await sel.select(user.role);
  await wait(300);

  // Click LOGIN button (type="submit", class glass-button, text "LOGIN")
  await page.evaluate(() => {
    const btn = document.querySelector('button[type="submit"]');
    if (btn) btn.click();
  });
  await wait(3500);

  // Verify login succeeded - check for sidebar presence
  const hasSidebar = await page.evaluate(() => {
    return document.querySelectorAll('button span').length > 5; // sidebar has many button>span items
  });
  if (!hasSidebar) {
    console.log('    WARN: Login may not have succeeded');
    // Fallback: try form submission
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) {
        const event = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(event);
      }
    });
    await wait(3000);
  }
  console.log('  >> Login complete');
}

async function logout() {
  console.log('  >> Logout');
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const b of btns) {
      if (b.textContent.includes('Logout')) { b.click(); return; }
    }
  });
  await wait(2000);
}

// Click sidebar item by menu label text (sidebar items are <button> with <span> children)
async function clickSidebar(label) {
  const found = await page.evaluate((label) => {
    const btns = document.querySelectorAll('button');
    for (const btn of btns) {
      const spans = btn.querySelectorAll('span');
      for (const span of spans) {
        if (span.textContent.trim() === label) {
          btn.click();
          return true;
        }
      }
    }
    return false;
  }, label);
  if (found) {
    await wait(2000);
    return true;
  }
  console.log(`    WARN: Sidebar "${label}" not found`);
  return false;
}

// Click any button containing specific text
async function clickBtnText(text) {
  const found = await page.evaluate((text) => {
    const btns = document.querySelectorAll('button');
    for (const b of btns) {
      if (b.textContent.includes(text)) { b.click(); return true; }
    }
    return false;
  }, text);
  if (found) await wait(2000);
  else console.log(`    WARN: Button "${text}" not found`);
  return found;
}

// Click Manage Case for a specific case ID
async function clickManageCase(caseId) {
  const found = await page.evaluate((caseId) => {
    const rows = document.querySelectorAll('tr');
    for (const row of rows) {
      if (row.textContent.includes(caseId)) {
        const btn = row.querySelector('button');
        if (btn) { btn.click(); return true; }
      }
    }
    return false;
  }, caseId);
  if (found) await wait(2500);
  else console.log(`    WARN: Case "${caseId}" not found`);
  return found;
}

async function getToken() {
  return await page.evaluate(() => sessionStorage.getItem('cf_token'));
}

// ====================================================================
async function main() {
  console.log('\n========================================');
  console.log(' CreditFlow Screenshot Automation v3');
  console.log('========================================\n');

  if (fs.existsSync(SCREENSHOT_DIR)) {
    fs.rmSync(SCREENSHOT_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox']
  });
  page = await browser.newPage();

  try {
    // ===================== SECTION 1: PUBLIC PAGES =====================
    console.log('=== SECTION 1: Public Pages ===');

    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle0', timeout: 15000 });
    await wait(2000);
    await screenshot('landing_page_hero');

    await page.evaluate(() => window.scrollTo(0, 750));
    await wait(800);
    await screenshot('landing_page_features_modules');

    await page.evaluate(() => window.scrollTo(0, 1500));
    await wait(800);
    await screenshot('landing_page_workflow_stages');

    await page.evaluate(() => window.scrollTo(0, 2200));
    await wait(800);
    await screenshot('landing_page_impact_stats');

    // Login page
    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle0' });
    await wait(1000);
    await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      for (const b of btns) { if (b.textContent.trim() === 'Sign In') { b.click(); return; } }
    });
    await wait(1500);
    await screenshot('login_page');

    // Register page
    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle0' });
    await wait(1000);
    await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      for (const b of btns) { if (b.textContent.includes('Create Staff Account')) { b.click(); return; } }
    });
    await wait(1500);
    await screenshot('register_page');

    // ===================== SECTION 2: SUPER ADMIN =====================
    console.log('\n=== SECTION 2: Super Admin ===');

    await login(USERS.admin);
    await screenshot('dashboard_super_admin_overview');

    await page.evaluate(() => window.scrollTo(0, 400));
    await wait(600);
    await screenshot('dashboard_super_admin_tasks_notifications');

    // Cases
    await clickSidebar('Cases');
    await screenshot('cases_list_all_admin');

    // Case CF-2025-0891 (Stage 4)
    await clickManageCase('CF-2025-0891');
    await screenshot('case_detail_stage4_credit_approval');
    await page.evaluate(() => window.scrollTo(0, 400));
    await wait(500);
    await screenshot('case_detail_stage4_approval_memo');

    // Case CF-2025-0890 (Stage 7)
    await clickSidebar('Cases');
    await clickManageCase('CF-2025-0890');
    await screenshot('case_detail_stage7_monitoring_active');
    await page.evaluate(() => window.scrollTo(0, 400));
    await wait(500);
    await screenshot('case_monitoring_compliance_tracker');

    // Case CF-2025-0889 (Stage 2)
    await clickSidebar('Cases');
    await clickManageCase('CF-2025-0889');
    await screenshot('case_detail_stage2_remedial_review');

    // Case CF-2025-0888 (Stage 6)
    await clickSidebar('Cases');
    await clickManageCase('CF-2025-0888');
    await screenshot('case_detail_stage6_ccpu_execution');

    // User Mgmt (exact sidebar label)
    await clickSidebar('User Mgmt');
    await screenshot('user_management_list');

    // Audit Logs
    await clickSidebar('Audit Logs');
    await screenshot('audit_logs_trail');
    await page.evaluate(() => window.scrollTo(0, 300));
    await wait(500);
    await screenshot('audit_logs_scrolled');

    // Reports
    await clickSidebar('Reports');
    await screenshot('reports_analytics_overview');
    await page.evaluate(() => window.scrollTo(0, 400));
    await wait(500);
    await screenshot('reports_analytics_charts');

    // Settings
    await clickSidebar('Settings');
    await screenshot('settings_system_parameters');
    await page.evaluate(() => window.scrollTo(0, 500));
    await wait(500);
    await screenshot('settings_cbs_loan_seeder');

    await logout();

    // ===================== SECTION 3: REMEDIAL OFFICER =====================
    console.log('\n=== SECTION 3: Remedial Officer ===');

    await login(USERS.remedial);
    await screenshot('dashboard_remedial_officer');

    await clickSidebar('Cases');
    await screenshot('cases_list_remedial_create_button');

    // Click + Create New Case (glass-button with text "Create New Case")
    await clickBtnText('Create New Case');
    await screenshot('case_creation_empty_form');

    // Click Retrieve
    await clickBtnText('Retrieve');
    await wait(2000);
    await screenshot('case_creation_cbs_data_retrieved');

    await page.evaluate(() => window.scrollTo(0, 300));
    await wait(500);
    await screenshot('case_creation_loan_details');

    // Click Calculate
    await clickBtnText('Calculate');
    await wait(2000);
    await screenshot('case_creation_financial_calculation');

    await page.evaluate(() => window.scrollTo(0, 600));
    await wait(500);
    await screenshot('case_creation_amortization_schedule');

    await page.evaluate(() => window.scrollTo(0, 200));
    await wait(500);
    await screenshot('case_creation_dpd_classification');

    // View existing stage 2 case
    await clickSidebar('Cases');
    await clickManageCase('CF-2025-0889');
    await screenshot('remedial_review_recommendation');

    await logout();

    // ===================== SECTION 4: CREDIT OFFICER =====================
    console.log('\n=== SECTION 4: Credit Officer ===');

    await login(USERS.credit);
    await screenshot('dashboard_credit_officer');

    await clickSidebar('Approvals');
    await screenshot('credit_approval_queue');

    await clickSidebar('Cases');
    await clickManageCase('CF-2025-0891');
    await screenshot('credit_officer_case_review');

    await page.evaluate(() => window.scrollTo(0, 400));
    await wait(500);
    await screenshot('credit_officer_approve_reject_buttons');

    await logout();

    // ===================== SECTION 5: SALES OFFICER =====================
    console.log('\n=== SECTION 5: Sales Officer ===');

    await login(USERS.sales);
    await screenshot('dashboard_sales_officer');

    await clickSidebar('Cases');
    await screenshot('cases_list_sales_officer');

    // Try to view a case
    const salesClicked = await clickManageCase('CF-2025-0891');
    if (salesClicked) await screenshot('sales_officer_case_consent_view');

    await logout();

    // ===================== SECTION 6: CCPU USER =====================
    console.log('\n=== SECTION 6: CCPU User ===');

    await login(USERS.ccpu);
    await screenshot('dashboard_ccpu_user');

    await clickSidebar('Cases');
    await clickManageCase('CF-2025-0888');
    await screenshot('ccpu_execution_view');

    await page.evaluate(() => window.scrollTo(0, 400));
    await wait(500);
    await screenshot('ccpu_execute_restructuring_button');

    await logout();

    // ===================== SECTION 7: RISK & COMPLIANCE =====================
    console.log('\n=== SECTION 7: Risk & Compliance ===');

    await login(USERS.risk);
    await screenshot('dashboard_risk_compliance');

    await clickSidebar('Monitoring');
    await screenshot('monitoring_cases_list');

    await clickSidebar('Cases');
    await clickManageCase('CF-2025-0890');
    await screenshot('risk_monitoring_case_detail');

    await page.evaluate(() => window.scrollTo(0, 400));
    await wait(500);
    await screenshot('risk_compliance_tracking_90_120_days');

    await clickSidebar('Audit Logs');
    await screenshot('risk_audit_logs_view');

    await clickSidebar('Reports');
    await screenshot('risk_reports_compliance_view');

    await logout();

    // ===================== SECTION 8: DOCUMENT VERIFICATION & AI =====================
    console.log('\n=== SECTION 8: Document Verification & AI ===');

    await login(USERS.remedial);
    const token = await getToken();

    // Advance CF-2025-0889 to Stage 3 via API
    console.log('  Advancing CF-2025-0889 to Stage 3...');
    const advRes = await page.evaluate(async (token) => {
      try {
        const res = await fetch('http://localhost:8080/api/cases/CF-2025-0889/stage', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({ stage: 3, comment: 'For doc verification demo', author: 'Kanchana Jayawardena' })
        });
        return { ok: res.ok, status: res.status };
      } catch(e) { return { error: e.message }; }
    }, token);
    console.log('  Advance result:', JSON.stringify(advRes));

    await clickSidebar('Cases');
    await clickManageCase('CF-2025-0889');
    await screenshot('doc_verification_page_initial');

    // Upload LEGIT documents
    console.log('  Uploading legit documents...');
    const legitFiles = ['legit_amara_request.pdf', 'legit_amara_salary.pdf', 'legit_amara_crib.pdf'];
    for (const name of legitFiles) {
      const fpath = path.resolve(__dirname, 'sample_docs', 'legit', name);
      if (fs.existsSync(fpath)) {
        const fileInput = await page.$('input[type="file"]');
        if (fileInput) {
          await fileInput.uploadFile(fpath);
          await wait(2500);
          console.log(`  Uploaded: ${name}`);
        }
      } else { console.log(`  File missing: ${fpath}`); }
    }
    await screenshot('doc_verification_legit_docs_uploaded');

    // Preview a document
    await page.evaluate(() => {
      const rows = document.querySelectorAll('table tbody tr, tr');
      for (let i = 1; i < rows.length; i++) {
        if (rows[i].querySelector('td')) { rows[i].click(); break; }
      }
    });
    await wait(2000);
    await screenshot('doc_preview_pdf_inline');

    // AI Verification - POSITIVE
    await clickBtnText('Verify Documents');
    await wait(10000); // AI scan takes time
    await screenshot('ai_verification_positive_result');

    await page.evaluate(() => window.scrollTo(0, 400));
    await wait(500);
    await screenshot('ai_verification_positive_confidence_scores');

    // NEGATIVE scenario: delete legit, upload fake
    console.log('  Setting up negative test...');
    for (const name of legitFiles) {
      await page.evaluate(async (token, fn) => {
        await fetch('http://localhost:8080/api/cases/CF-2025-0889/files/' + fn, {
          method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token }
        });
      }, token, name);
    }
    await wait(1000);

    await clickSidebar('Cases');
    await clickManageCase('CF-2025-0889');
    await wait(1500);

    const fakeFiles = ['fake_wrong_name_amara_request.pdf', 'fake_wrong_name_amara_salary.pdf', 'fake_crib_wrong_name.pdf'];
    for (const name of fakeFiles) {
      const fpath = path.resolve(__dirname, 'sample_docs', 'fake', name);
      if (fs.existsSync(fpath)) {
        const fileInput = await page.$('input[type="file"]');
        if (fileInput) {
          await fileInput.uploadFile(fpath);
          await wait(2500);
          console.log(`  Uploaded fake: ${name}`);
        }
      } else { console.log(`  Fake file missing: ${fpath}`); }
    }
    await screenshot('doc_verification_fake_docs_uploaded');

    await page.evaluate(() => {
      const rows = document.querySelectorAll('tr');
      for (let i = 1; i < rows.length; i++) {
        if (rows[i].querySelector('td')) { rows[i].click(); break; }
      }
    });
    await wait(2000);
    await screenshot('doc_preview_fake_document');

    await clickBtnText('Verify Documents');
    await wait(10000);
    await screenshot('ai_verification_negative_result');

    await page.evaluate(() => window.scrollTo(0, 400));
    await wait(500);
    await screenshot('ai_verification_negative_low_confidence');

    await screenshot('doc_delete_button_visible');

    await logout();

    // ===================== SECTION 9: NEGATIVE TESTS =====================
    console.log('\n=== SECTION 9: Negative Tests ===');

    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle0' });
    await wait(1000);
    await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      for (const b of btns) { if (b.textContent.trim() === 'Sign In') { b.click(); return; } }
    });
    await wait(1500);

    // Type wrong credentials
    const wrongUser = await page.$('input[type="text"].glass-input');
    if (wrongUser) { await wrongUser.click({ clickCount: 3 }); await wrongUser.type('invaliduser'); }
    const wrongPw = await page.$('input[type="password"].glass-input');
    if (wrongPw) { await wrongPw.click({ clickCount: 3 }); await wrongPw.type('wrongpassword'); }

    await page.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]');
      if (btn) btn.click();
    });
    await wait(3000);
    await screenshot('login_failed_invalid_credentials');

    // ===================== DONE =====================
    console.log('\n========================================');
    console.log(` DONE: ${screenshotCounter} screenshots`);
    console.log(` Location: ${SCREENSHOT_DIR}`);
    console.log('========================================');

  } catch (error) {
    console.error('\nFATAL ERROR:', error.message);
    console.error(error.stack);
    try {
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'ERROR.png'), fullPage: true });
    } catch(e) {}
  } finally {
    await browser.close();
  }
}

main();
