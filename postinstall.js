#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DEFAULT_CONFIG = {
  baseUrl: 'https://your-live-site.com',
  routes: ['/', '/about', '/contact'],
  output: './grammar-report.csv',
  chunkSize: 4000,
  delayMs: 500,
};

const configPath = path.resolve(process.cwd(), 'grammar.config.json');

if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2));
  console.log('\n✅ grammar.config.json created in your project root.');
  console.log('👉 Please update baseUrl and routes, then run: npm run grammar-check\n');
}
