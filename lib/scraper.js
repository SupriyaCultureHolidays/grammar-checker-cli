const puppeteer = require('puppeteer');

let browser;

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({ headless: 'new' });
  }
  return browser;
}

async function scrapeText(url) {
  const b = await getBrowser();
  const page = await b.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const text = await page.evaluate(() => document.body.innerText);
    return text.trim();
  } finally {
    await page.close();
  }
}

async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

module.exports = { scrapeText, closeBrowser };
