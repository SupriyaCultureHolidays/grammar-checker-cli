#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { loadConfig } = require('./lib/utils');
const { scrapeText } = require('./lib/scraper');
const { checkGrammar } = require('./lib/checker');
const { writeReport } = require('./lib/csv');

async function run() {
  const configPath = path.resolve(process.cwd(), 'grammar.config.json');

  if (!fs.existsSync(configPath)) {
    console.error('❌ grammar.config.json not found. Please create it first.');
    process.exit(1);
  }
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
