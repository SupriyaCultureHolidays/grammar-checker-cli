#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { loadConfig } = require('./lib/utils');
const { scrapeText } = require('./lib/scraper');
const { checkGrammar } = require('./lib/checker');
const { writeReport } = require('./lib/csv');

const DEFAULT_CONFIG = {
  baseUrl: 'https://your-live-site.com',
  routes: ['/', '/about', '/contact'],
  output: './grammar-report.csv',
  chunkSize: 4000,
  delayMs: 500,
};

function initConfig() {
  const configPath = path.resolve(process.cwd(), 'grammar.config.json');
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2));
    console.log('✅ grammar.config.json created in your project root.');
    console.log('👉 Please update baseUrl and routes, then run again.\n');
    process.exit(0);
  }
}

async function run() {
  initConfig();
  const configPath = path.resolve(process.cwd(), 'grammar.config.json');
  const config = loadConfig(configPath);

  const { baseUrl, routes, output, chunkSize = 4000, delayMs = 500 } = config;
  const allIssues = [];

  for (const route of routes) {
    const url = `${baseUrl}${route}`;
    console.log(`Checking: ${route}`);

    let text;
    try {
      text = await scrapeText(url);
    } catch (err) {
      console.error(`  Skipping ${route}: ${err.message}`);
      continue;
    }

    if (!text || !text.trim()) {
      console.log(`  Empty content, skipping.`);
      continue;
    }

    const issues = await checkGrammar(text, url, chunkSize, delayMs);
    console.log(`  Found ${issues.length} issues`);
    allIssues.push(...issues);
  }

  const outputPath = path.resolve(process.cwd(), output);
  await writeReport(allIssues, outputPath);
  console.log(`\nReport generated at: ${output}`);
}

run().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
