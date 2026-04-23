const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const HTML_EXTS = ['.html'];
const JSX_EXTS  = ['.js', '.jsx', '.ts', '.tsx'];
const ALL_EXTS  = [...HTML_EXTS, ...JSX_EXTS];

function findFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findFiles(full));
    else if (ALL_EXTS.includes(path.extname(entry.name))) results.push(full);
  }
  return results;
}

function extractFromHtml(filePath) {
  const $ = cheerio.load(fs.readFileSync(filePath, 'utf-8'));
  $('script, style').remove();
  const parts = [];
  $('body *').contents().filter((_, n) => n.type === 'text').each((_, n) => {
    const v = n.data.trim();
    if (v) parts.push(v);
  });
  $('[alt],[placeholder],[title],[aria-label],[aria-placeholder]').each((_, el) => {
    ['alt', 'placeholder', 'title', 'aria-label', 'aria-placeholder'].forEach(attr => {
      const v = $(el).attr(attr);
      if (v && v.trim()) parts.push(v.trim());
    });
  });
  return parts;
}

function extractFromJsx(filePath) {
  const src = fs.readFileSync(filePath, 'utf-8');
  const parts = [];

  // Text between JSX tags: >Some text< (skip pure whitespace and {expressions})
  const textNode = />([^<>{]+)</g;
  let m;
  while ((m = textNode.exec(src)) !== null) {
    const v = m[1].trim();
    if (v && !/^[{]/.test(v)) parts.push(v);
  }

  // String literal attributes: alt="...", placeholder="...", title="...", aria-label="..."
  const attrRe = /(?:alt|placeholder|title|aria-label|aria-placeholder)=["']([^"'{}]+)["']/g;
  while ((m = attrRe.exec(src)) !== null) {
    const v = m[1].trim();
    if (v) parts.push(v);
  }

  return parts;
}

function extractText(filePath) {
  const ext = path.extname(filePath);
  const parts = HTML_EXTS.includes(ext)
    ? extractFromHtml(filePath)
    : extractFromJsx(filePath);
  return parts.join('\n');
}

module.exports = { findFiles, extractText };
