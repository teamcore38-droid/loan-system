/**
 * CreditFlow - Comprehensive Screenshot Automation
 * Captures all system pages, workflows, and role-specific views
 * for project proposal documentation.
 */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const FRONTEND_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:8080/api';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// User credentials from data.sql
const USERS = {
  admin:   { username: 'admin',   password: 'password', role: 'Super Admin' },
  remedial:{ username: 'remedial',password: 'password', role: 'Remedial Officer' },
  credit:  { username: 'credit',  password: 'password', role: 'Credit Officer' },
  sales:   { username: 'sales',   password: 'password', role: 'Sales Officer' },
  ccpu:    { username: 'ccpu',    password: 'password', role: 'CCPU User' },
  risk:    { username: 'risk',    password: 'password', role: 'Risk & Compliance' }
};

let screenshotCounter = 0;
let browser, page;

async function screenshot(name) {
  screenshotCounter++;
  const num = String(screenshotCounter).padStart(2, '0');
  const filename = `${num}_${name}.png`;
  const filepath = path.join(SCREENSHOT_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: false });
  console.log(`  [${num}] Captured: ${filename}`);
  return filename;
}

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function login(user) {
  console.log(`\n  Logging in as: ${user.username} (${user.role}) (using Demo Login Bypass)`);
  await page.goto(FRONTEND_URL, { waitUntil: 'networkidle0', timeout: 15000 });
  await wait(1000);

  // Click Sign In from landing page
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Sign In') || text.includes('Launch Application')) {
      await btn.click();
      break;
    }
  }
  await wait(1500);

  // Select role in select dropdown
  const selects = await page.$$('select');
  if (selects.length > 0) {
    await selects[0].select(user.role);
  }
  await wait(500);

  // Click "DEMO LOGIN" button
  const demoLoginBtns = await page.$$('button');
  let clickedDemo = false;
  for (const btn of demoLoginBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('DEMO LOGIN')) {
      await btn.click();
      clickedDemo = true;
      break;
    }
  }
  
  if (!clickedDemo) {
    console.log("  Warning: DEMO LOGIN button not found, falling back to standard login...");
    // Fill credentials as fallback
    const inputs = await page.$$('input');
    if (inputs.length >= 2) {
      await inputs[0].click({ clickCount: 3 });
      await inputs[0].type(user.username);
      await inputs[1].click({ clickCount: 3 });
      await inputs[1].type(user.password);
    }
    const loginBtns = await page.$$('button');
    for (const btn of loginBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.trim() === 'LOGIN') {
        await btn.click();
        break;
      }
    }
  }
  await wait(2500);
}

async function logout() {
  console.log('  Logging out...');
  // Click sidebar logout button
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Logout') || text.includes('Sign Out')) {
      await btn.click();
      await wait(1500);
      return;
    }
  }
  // Fallback: clear session and go to landing
  await page.evaluate(() => {
    sessionStorage.clear();
  });
  await page.goto(FRONTEND_URL, { waitUntil: 'networkidle0' });
  await wait(1000);
}

async function clickSidebarItem(text) {
  // Select all buttons on the page since sidebar items are <button> elements
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const btnText = await page.evaluate(el => el.textContent.trim(), btn);
    if (btnText === text || btnText.includes(text)) {
      await btn.click();
      await wait(2000);
      return true;
    }
  }
  
  // Fallback: try other elements in case it's in a div or span
  const spans = await page.$$('span, div');
  for (const item of spans) {
    const itemText = await page.evaluate(el => el.textContent.trim(), item);
    if (itemText === text || itemText.includes(text)) {
      await item.click();
      await wait(2000);
      return true;
    }
  }
  console.log(`    Warning: Could not find sidebar item "${text}"`);
  return false;
}

async function clickButton(text) {
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const btnText = await page.evaluate(el => el.textContent.trim(), btn);
    if (btnText.includes(text)) {
      await btn.click();
      await wait(2000);
      return true;
    }
  }
  console.log(`    Warning: Could not find button "${text}"`);
  return false;
}

// ====================================================================
// MAIN SCREENSHOT WORKFLOW
// ====================================================================
async function main() {
  console.log('\n=== CreditFlow Screenshot Automation ===\n');
  
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  console.log(`Screenshots directory: ${SCREENSHOT_DIR}\n`);

  browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  page = await browser.newPage();

  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[AI SERVICE]') || text.includes('Error') || text.includes('failed') || text.includes('connection')) {
      console.log('  [Browser Log]:', text);
    }
  });
  page.on('pageerror', err => {
    console.log('  [Browser Error]:', err.toString());
  });

  try {
    // ============================================================
    // SECTION 1: PUBLIC PAGES (Landing, Login, Register)
    // ============================================================
    console.log('--- SECTION 1: Public Pages ---');
    
    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle0', timeout: 15000 });
    await wait(1500);
    await screenshot('landing_page_hero');

    // Scroll to features section
    await page.evaluate(() => {
      const el = document.querySelector('#features');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await wait(800);
    await screenshot('landing_page_features');

    // Scroll to workflow section
    await page.evaluate(() => {
      const el = document.querySelector('#workflow');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await wait(800);
    await screenshot('landing_page_workflow');

    // Scroll to stats section
    await page.evaluate(() => {
      const el = document.querySelector('#stats');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await wait(800);
    await screenshot('landing_page_impact_stats');

    // Navigate to Login page
    const signInBtns = await page.$$('button');
    for (const btn of signInBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Sign In')) {
        await btn.click();
        break;
      }
    }
    await wait(1500);
    await screenshot('login_page');

    // Navigate to Register page
    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle0' });
    await wait(1000);
    const regBtns = await page.$$('button');
    for (const btn of regBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Create Staff Account')) {
        await btn.click();
        break;
      }
    }
    await wait(1500);
    await screenshot('register_page');

    // ============================================================
    // SECTION 2: SUPER ADMIN - Dashboard & Management
    // ============================================================
    console.log('\n--- SECTION 2: Super Admin Views ---');
    
    await login(USERS.admin);
    await screenshot('dashboard_super_admin');

    // Cases list
    await clickSidebarItem('Cases');
    await wait(1500);
    await screenshot('cases_list_all');

    // User Management
    await clickSidebarItem('User');
    await wait(1500);
    await screenshot('user_management_list');

    // Customers Directory
    await clickSidebarItem('Customers');
    await wait(1500);
    await screenshot('customer_directory_list');

    // Audit Logs
    await clickSidebarItem('Audit');
    await wait(1500);
    await screenshot('audit_logs_trail');

    // Scroll audit logs table down
    await page.evaluate(() => {
      const container = document.querySelector('.table-container');
      if (container) container.scrollTop = 300;
    });
    await wait(800);
    await screenshot('audit_logs_scrolled');

    // Reports
    await clickSidebarItem('Reports');
    await wait(1500);
    await screenshot('reports_analytics_overview');

    // Scroll to charts in reports
    await page.evaluate(() => window.scrollTo(0, 400));
    await wait(800);
    await screenshot('reports_analytics_charts');

    // Settings
    await clickSidebarItem('Settings');
    await wait(1500);
    await screenshot('settings_system_parameters');

    // Scroll to CBS Seeder section
    await page.evaluate(() => window.scrollTo(0, 400));
    await wait(800);
    await screenshot('settings_cbs_loan_seeder');

    // View case CF-2025-0891 (Stage 4) as Admin
    await clickSidebarItem('Cases');
    await wait(1500);
    let manageBtns = await page.$$('button');
    for (const btn of manageBtns) {
      const text = await page.evaluate(el => el.textContent.trim(), btn);
      if (text.includes('Manage Case')) {
        await btn.click();
        break;
      }
    }
    await wait(2000);
    await screenshot('case_detail_stage4_credit_approval');

    // View case CF-2025-0890 (Stage 7 Monitoring)
    await clickSidebarItem('Cases');
    await wait(1500);
    manageBtns = await page.$$('button');
    let clicked = false;
    for (const btn of manageBtns) {
      const row = await page.evaluate(el => {
        const tr = el.closest('tr');
        return tr ? tr.textContent : '';
      }, btn);
      if (row.includes('CF-2025-0890') && !clicked) {
        await btn.click();
        clicked = true;
        break;
      }
    }
    await wait(2000);
    await screenshot('case_detail_stage7_monitoring_active');

    // Scroll to monitoring tracker
    await page.evaluate(() => window.scrollTo(0, 400));
    await wait(800);
    await screenshot('case_detail_monitoring_compliance_tracker');

    // View CF-2025-0889 (Stage 2)
    await clickSidebarItem('Cases');
    await wait(1500);
    manageBtns = await page.$$('button');
    clicked = false;
    for (const btn of manageBtns) {
      const row = await page.evaluate(el => {
        const tr = el.closest('tr');
        return tr ? tr.textContent : '';
      }, btn);
      if (row.includes('CF-2025-0889') && !clicked) {
        await btn.click();
        clicked = true;
        break;
      }
    }
    await wait(2000);
    await screenshot('case_detail_stage2_remedial_review');

    // View CF-2025-0888 (Stage 6)
    await clickSidebarItem('Cases');
    await wait(1500);
    manageBtns = await page.$$('button');
    clicked = false;
    for (const btn of manageBtns) {
      const row = await page.evaluate(el => {
        const tr = el.closest('tr');
        return tr ? tr.textContent : '';
      }, btn);
      if (row.includes('CF-2025-0888') && !clicked) {
        await btn.click();
        clicked = true;
        break;
      }
    }
    await wait(2000);
    await screenshot('case_detail_stage6_ccpu_execution');

    await logout();

    // ============================================================
    // SECTION 3: REMEDIAL OFFICER - Case Creation & Doc Verification
    // ============================================================
    console.log('\n--- SECTION 3: Remedial Officer Flow ---');
    
    await login(USERS.remedial);
    await screenshot('dashboard_remedial_officer');

    // Case list with Create button visible
    await clickSidebarItem('Cases');
    await wait(1500);
    await screenshot('cases_list_remedial_with_create_button');

    // Click Create New Case
    await clickButton('Create New Case');
    await wait(1500);
    await screenshot('case_creation_empty_form');

    // Click Retrieve to load loan data
    await clickButton('Retrieve');
    await wait(2500);
    await screenshot('case_creation_retrieved_cbs_data');

    // Click Calculate
    await clickButton('Calculate');
    await wait(1500);
    await screenshot('case_creation_financial_calculation');

    // Scroll to amortization schedule
    await page.evaluate(() => {
      const tables = document.querySelectorAll('table');
      if (tables.length > 0) {
        tables[tables.length - 1].scrollIntoView({ behavior: 'instant' });
      }
    });
    await wait(800);
    await screenshot('case_creation_amortization_schedule');

    // View Stage 2 case (CF-2025-0889 - Remedial Review) as Remedial Officer
    await clickSidebarItem('Cases');
    await wait(1500);
    manageBtns = await page.$$('button');
    clicked = false;
    for (const btn of manageBtns) {
      const row = await page.evaluate(el => {
        const tr = el.closest('tr');
        return tr ? tr.textContent : '';
      }, btn);
      if (row.includes('CF-2025-0889') && !clicked) {
        await btn.click();
        clicked = true;
        break;
      }
    }
    await wait(2000);
    await screenshot('remedial_review_recommendation_form');

    await logout();

    // ============================================================
    // SECTION 4: CREDIT OFFICER - Approval Flow
    // ============================================================
    console.log('\n--- SECTION 4: Credit Officer Flow ---');
    
    await login(USERS.credit);
    await screenshot('dashboard_credit_officer');

    // View approvals queue
    await clickSidebarItem('Approvals');
    await wait(1500);
    await screenshot('credit_approval_queue');

    // View the pending approval case (CF-2025-0891 Stage 4)
    await clickSidebarItem('Cases');
    await wait(1500);
    manageBtns = await page.$$('button');
    clicked = false;
    for (const btn of manageBtns) {
      const row = await page.evaluate(el => {
        const tr = el.closest('tr');
        return tr ? tr.textContent : '';
      }, btn);
      if (row.includes('CF-2025-0891') && !clicked) {
        await btn.click();
        clicked = true;
        break;
      }
    }
    await wait(2000);
    await screenshot('credit_officer_approval_actions');

    // Scroll to show approval buttons
    await page.evaluate(() => window.scrollTo(0, 350));
    await wait(800);
    await screenshot('credit_officer_approve_reject_buttons');

    await logout();

    // ============================================================
    // SECTION 5: SALES OFFICER - Consent Collection
    // ============================================================
    console.log('\n--- SECTION 5: Sales Officer Flow ---');
    
    await login(USERS.sales);
    await screenshot('dashboard_sales_officer');

    // View cases list
    await clickSidebarItem('Cases');
    await wait(1500);
    await screenshot('cases_list_sales_officer');

    // View a stage 5 case if available, otherwise show case list
    manageBtns = await page.$$('button');
    clicked = false;
    for (const btn of manageBtns) {
      const row = await page.evaluate(el => {
        const tr = el.closest('tr');
        return tr ? tr.textContent : '';
      }, btn);
      // Try stage 5 (Sales Consent) case or any case
      if ((row.includes('Pending Customer') || row.includes('Manage Case')) && !clicked) {
        const text = await page.evaluate(el => el.textContent.trim(), btn);
        if (text.includes('Manage Case')) {
          await btn.click();
          clicked = true;
          break;
        }
      }
    }
    if (clicked) {
      await wait(2000);
      await screenshot('sales_officer_case_view');
    }

    await logout();

    // ============================================================
    // SECTION 6: CCPU USER - CBS Execution
    // ============================================================
    console.log('\n--- SECTION 6: CCPU User Flow ---');
    
    await login(USERS.ccpu);
    await screenshot('dashboard_ccpu_user');

    // View case CF-2025-0888 (Stage 6)
    await clickSidebarItem('Cases');
    await wait(1500);
    manageBtns = await page.$$('button');
    clicked = false;
    for (const btn of manageBtns) {
      const row = await page.evaluate(el => {
        const tr = el.closest('tr');
        return tr ? tr.textContent : '';
      }, btn);
      if (row.includes('CF-2025-0888') && !clicked) {
        await btn.click();
        clicked = true;
        break;
      }
    }
    await wait(2000);
    await screenshot('ccpu_execution_view');

    // Scroll to action buttons
    await page.evaluate(() => window.scrollTo(0, 350));
    await wait(800);
    await screenshot('ccpu_execute_restructuring_button');

    await logout();

    // ============================================================
    // SECTION 7: RISK & COMPLIANCE - Monitoring
    // ============================================================
    console.log('\n--- SECTION 7: Risk & Compliance Flow ---');
    
    await login(USERS.risk);
    await screenshot('dashboard_risk_compliance');

    // Monitoring view
    await clickSidebarItem('Monitoring');
    await wait(1500);
    await screenshot('monitoring_cases_list');

    // View monitored case CF-2025-0890 (Stage 7)
    manageBtns = await page.$$('button');
    clicked = false;
    for (const btn of manageBtns) {
      const row = await page.evaluate(el => {
        const tr = el.closest('tr');
        return tr ? tr.textContent : '';
      }, btn);
      if (row.includes('CF-2025-0890') && !clicked) {
        await btn.click();
        clicked = true;
        break;
      }
    }
    await wait(2000);
    await screenshot('risk_monitoring_case_detail');

    // Scroll to monitoring tracker
    await page.evaluate(() => window.scrollTo(0, 400));
    await wait(800);
    await screenshot('risk_compliance_tracking_90_120_days');

    // Audit Logs from Risk perspective
    await clickSidebarItem('Audit');
    await wait(1500);
    await screenshot('risk_audit_logs_view');

    // Reports from Risk perspective
    await clickSidebarItem('Reports');
    await wait(1500);
    await screenshot('risk_reports_compliance_view');

    await logout();

    // ============================================================
    // SECTION 8: DOC VERIFICATION & AI SCAN (Positive & Negative)
    // ============================================================
    console.log('\n--- SECTION 8: Document Verification & AI ---');
    
    // We need a case at Stage 3 for Doc Verification.
    // Let's advance CF-2025-0889 from Stage 2 to Stage 3 via API
    // First login as remedial to get token
    await login(USERS.remedial);

    // Get token from sessionStorage
    const token = await page.evaluate(() => sessionStorage.getItem('cf_token'));

    // Advance CF-2025-0889 to Stage 3 via API
    console.log('  Advancing CF-2025-0889 to Stage 3 for doc verification demo...');
    const advanceRes = await page.evaluate(async () => {
      try {
        const res = await window.api.updateCaseStage('CF-2025-0889', 3, 'Advancing to document verification for screenshots');
        return { ok: !!res, status: res ? 200 : 500 };
      } catch (e) {
        return { ok: false, error: e.message };
      }
    });
    console.log('  Stage advance result:', advanceRes);
    await wait(1000);

    // Navigate to case detail for doc verification
    await clickSidebarItem('Cases');
    await wait(1500);
    manageBtns = await page.$$('button');
    clicked = false;
    for (const btn of manageBtns) {
      const row = await page.evaluate(el => {
        const tr = el.closest('tr');
        return tr ? tr.textContent : '';
      }, btn);
      if (row.includes('CF-2025-0889') && !clicked) {
        await btn.click();
        clicked = true;
        break;
      }
    }
    await wait(2500);
    await screenshot('doc_verification_page_initial');

    // Upload LEGIT documents
    console.log('  Uploading legit documents for positive test...');
    const legitFiles = [
      'sample_docs/legit/legit_amara_request.pdf',
      'sample_docs/legit/legit_amara_salary.pdf',
      'sample_docs/legit/legit_amara_crib.pdf'
    ];

    for (const filePath of legitFiles) {
      const fullPath = path.resolve(__dirname, filePath);
      if (fs.existsSync(fullPath)) {
        const fileInput = await page.$('input[type="file"]');
        if (fileInput) {
          await fileInput.uploadFile(fullPath);
          await wait(2500);
        }
      }
    }
    await screenshot('doc_verification_legit_docs_uploaded');

    // Click on a document to show preview
    const docRows = await page.$$('table tbody tr');
    if (docRows.length > 1) {
      await docRows[1].click();
      await wait(2000);
      await screenshot('doc_preview_pdf_inline');
    }

    // Click Verify Documents button for POSITIVE AI scan
    await clickButton('Verify Documents');
    await wait(5000); // Allow time for AI scan
    await screenshot('ai_verification_positive_result');

    // Close alert if any
    await page.evaluate(() => {
      const closeBtn = document.querySelector('[style*="position: fixed"] button');
      if (closeBtn) closeBtn.click();
    });
    await wait(500);
    await screenshot('ai_verification_positive_confidence_score');

    // Now test NEGATIVE scenario: Delete legit docs, upload fake docs
    console.log('  Setting up negative (fake) document test...');

    // Delete existing uploaded docs via API
    for (const filePath of legitFiles) {
      const fileName = path.basename(filePath);
      await page.evaluate(async (fn) => {
        try {
          await window.api.deleteCaseDocument('CF-2025-0889', fn);
        } catch (e) {
          console.error(e);
        }
      }, fileName);
    }
    await wait(1000);

    // Refresh the page to reload case
    await clickSidebarItem('Cases');
    await wait(1500);
    manageBtns = await page.$$('button');
    clicked = false;
    for (const btn of manageBtns) {
      const row = await page.evaluate(el => {
        const tr = el.closest('tr');
        return tr ? tr.textContent : '';
      }, btn);
      if (row.includes('CF-2025-0889') && !clicked) {
        await btn.click();
        clicked = true;
        break;
      }
    }
    await wait(2500);

    // Upload FAKE documents
    const fakeFiles = [
      'sample_docs/fake/fake_wrong_name_amara_request.pdf',
      'sample_docs/fake/fake_wrong_name_amara_salary.pdf',
      'sample_docs/fake/fake_crib_wrong_name.pdf'
    ];

    for (const filePath of fakeFiles) {
      const fullPath = path.resolve(__dirname, filePath);
      if (fs.existsSync(fullPath)) {
        const fileInput = await page.$('input[type="file"]');
        if (fileInput) {
          await fileInput.uploadFile(fullPath);
          await wait(2500);
        }
      }
    }
    await screenshot('doc_verification_fake_docs_uploaded');

    // Click on fake doc for preview
    const fakeDocRows = await page.$$('table tbody tr');
    if (fakeDocRows.length > 1) {
      await fakeDocRows[1].click();
      await wait(2000);
      await screenshot('doc_preview_fake_document');
    }

    // Click Verify Documents for NEGATIVE scan
    await clickButton('Verify Documents');
    await wait(5000);
    await screenshot('ai_verification_negative_result');

    await page.evaluate(() => {
      const closeBtn = document.querySelector('[style*="position: fixed"] button');
      if (closeBtn) closeBtn.click();
    });
    await wait(500);
    await screenshot('ai_verification_negative_low_confidence');

    // Delete button demonstration
    await screenshot('doc_delete_button_visible');

    await logout();

    // ============================================================
    // SECTION 9: LOGIN FAILURE (Negative test)
    // ============================================================
    console.log('\n--- SECTION 9: Negative Tests ---');
    
    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle0' });
    await wait(1000);
    // Go to login page
    const allBtns = await page.$$('button');
    for (const btn of allBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Sign In') || text.includes('Launch Application')) {
        await btn.click();
        break;
      }
    }
    await wait(1500);

    // Type wrong credentials
    const loginInputs = await page.$$('input');
    if (loginInputs.length >= 2) {
      await loginInputs[0].click({ clickCount: 3 });
      await loginInputs[0].type('wronguser');
      await loginInputs[1].click({ clickCount: 3 });
      await loginInputs[1].type('wrongpassword');
    }
    await wait(300);

    // Attempt login
    const failBtns = await page.$$('button');
    for (const btn of failBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Sign In')) {
        await btn.click();
        break;
      }
    }
    await wait(2500);
    await screenshot('login_failed_invalid_credentials');

    // ============================================================
    // FINAL SUMMARY
    // ============================================================
    console.log(`\n=== COMPLETE ===`);
    console.log(`Total screenshots captured: ${screenshotCounter}`);
    console.log(`Saved to: ${SCREENSHOT_DIR}\n`);

  } catch (error) {
    console.error('Error during screenshot capture:', error);
    // Take error screenshot
    try {
      await page.screenshot({ 
        path: path.join(SCREENSHOT_DIR, 'ERROR_screenshot.png'), 
        fullPage: true 
      });
    } catch(e) {}
  } finally {
    await browser.close();
  }
}

main();
