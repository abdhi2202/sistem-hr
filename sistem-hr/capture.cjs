const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const dir = '../docs/screenshots';
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  async function login(email, password, roleLabel) {
    console.log(`\n[${roleLabel}] Logging in as ${email}...`);
    await page.goto('http://localhost:5174/login', { waitUntil: 'networkidle2' });
    
    await page.waitForSelector('input[type="email"]');
    
    await page.click('input[type="email"]', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('input[type="email"]', email);
    
    await page.click('input[type="password"]', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('input[type="password"]', password);
    
    await page.click('button[type="submit"]');
    
    console.log(`[${roleLabel}] Waiting for navigation...`);
    try {
      await page.waitForFunction(() => !window.location.href.includes('/login'), { timeout: 10000 });
      console.log(`[${roleLabel}] Login successful. URL: ${page.url()}`);
    } catch (e) {
      console.error(`[${roleLabel}] Login timeout.`);
      await page.screenshot({ path: `${dir}/fail-${roleLabel}.png` });
      const html = await page.content();
      fs.writeFileSync(`${dir}/fail-${roleLabel}.html`, html);
    }
  }

  async function takeScreenshot(path, name) {
    console.log(`Navigating to ${path}...`);
    await page.goto(`http://localhost:5174${path}`, { waitUntil: 'networkidle2' });
    if (page.url().includes('login')) {
        console.log(`Warning: Redirected to login while taking ${name}`);
    }
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: `${dir}/${name}.png` });
    console.log(`Saved ${name}.png`);
  }

  // --- INITIAL / LOGIN PAGE ---
  console.log('Capturing initial login page...');
  await page.goto('http://localhost:5174/login', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: `${dir}/login.png` });
  console.log('Saved login.png');

  // --- ADMIN ---
  await login('admin@ssms.test', 'password', 'ADMIN');
  await takeScreenshot('/dashboard', 'admin-dashboard');
  await takeScreenshot('/karyawan', 'admin-karyawan');
  await takeScreenshot('/master', 'admin-master');

  // --- LOGOUT ---
  console.log('Clearing session...');
  await page.evaluate(() => localStorage.clear());

  // --- EMPLOYEE ---
  await login('rina.paramita@ssms.test', 'password', 'EMPLOYEE');
  await takeScreenshot('/dashboard', 'emp-dashboard');
  await takeScreenshot('/absensi', 'emp-absensi');
  await takeScreenshot('/cuti', 'emp-cuti');

  await browser.close();
  console.log('\nDone.');
})();
