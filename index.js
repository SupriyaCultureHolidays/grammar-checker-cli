#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { loadConfig } = require('./lib/utils');
const { findFiles, extractText } = require('./lib/scraper');
const { checkGrammar } = require('./lib/checker');
const { writeReport } = require('./lib/csv');

async function run() {
  const configPath = path.resolve(process.cwd(), 'grammar.config.json');

  if (!fs.existsSync(configPath)) {
    console.error('❌ grammar.config.json not found. Please create it first.');
    process.exit(1);
  }
  const config = loadConfig(configPath);

  const { htmlDir, output, chunkSize = 4000, delayMs = 500 } = config;
  const resolvedDir = path.resolve(process.cwd(), htmlDir);

  if (!fs.existsSync(resolvedDir)) {
    console.error(`❌ htmlDir not found: ${resolvedDir}`);
    process.exit(1);
  }

  const htmlFiles = findFiles(resolvedDir);
  if (!htmlFiles.length) {
    console.log('No HTML/JSX/JS files found.');
    process.exit(0);
  }

  const allIssues = [];

  for (const filePath of htmlFiles) {
    const label = path.relative(process.cwd(), filePath);
    console.log(`Checking: ${label}`);

    let text;
    try {
      text = extractText(filePath);
    } catch (err) {
      console.error(`  Skipping: ${err.message}`);
      continue;
    }

    if (!text.trim()) {
      console.log('  Empty content, skipping.');
      continue;
    }

    const issues = await checkGrammar(text, label, chunkSize, delayMs);
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
