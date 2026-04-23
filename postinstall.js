#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectRoot = process.env.INIT_CWD || process.cwd();

// 1. Auto-create grammar.config.json
const configPath = path.resolve(projectRoot, 'grammar.config.json');
if (!fs.existsSync(configPath)) {
  const DEFAULT_CONFIG = {
    baseUrl: 'https://your-live-site.com',
    routes: ['/', '/about', '/contact'],
    output: './grammar-report.csv',
    chunkSize: 4000,
    delayMs: 500,
  };
  fs.writeFileSync(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2));
  console.log('\n✅ grammar.config.json created in your project root.');
  console.log('👉 Update baseUrl and routes with your site details.\n');
}

// 2. Auto-add grammar-check script to package.json
const pkgPath = path.resolve(projectRoot, 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  if (!pkg.scripts) pkg.scripts = {};
  if (!pkg.scripts['grammar-check']) {
    pkg.scripts['grammar-check'] = 'grammar-check';
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log('✅ "grammar-check" script added to your package.json.');
    console.log('👉 Now run: npm run grammar-check\n');
  }
}
