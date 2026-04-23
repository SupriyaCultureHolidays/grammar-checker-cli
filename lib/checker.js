const axios = require('axios');
const { chunkText, sleep } = require('./utils');

const LT_API = 'https://api.languagetool.org/v2/check';
const seen = new Set();

async function checkChunk(text, url, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const params = new URLSearchParams({ text, language: 'en-US' });
      const { data } = await axios.post(LT_API, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 15000,
      });
      return data.matches || [];
    } catch (err) {
      if (attempt === retries) {
        console.error(`  API error (giving up): ${err.message}`);
        return [];
      }
      await sleep(1000 * (attempt + 1));
    }
  }
}

async function checkGrammar(text, url, chunkSize, delayMs) {
  const chunks = chunkText(text, chunkSize);
  const issues = [];

  for (const chunk of chunks) {
    const matches = await checkChunk(chunk, url);
    for (const match of matches) {
      const wrong = chunk.slice(match.offset, match.offset + match.length);
      const suggestion = match.replacements?.[0]?.value || '';
      const context = match.context?.text || '';
      const key = `${url}|${wrong}|${suggestion}`;
      if (seen.has(key)) continue;
      seen.add(key);
      issues.push({ url, wrong, suggestion, context });
    }
    await sleep(delayMs);
  }

  return issues;
}

module.exports = { checkGrammar };
