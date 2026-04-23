const fs = require('fs');

function loadConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }
  let config;
  try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } catch {
    throw new Error('Invalid JSON in grammar.config.json');
  }
  if (!config.baseUrl || !Array.isArray(config.routes) || !config.output) {
    throw new Error('Config must include baseUrl, routes, and output fields');
  }
  return config;
}

function chunkText(text, size) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { loadConfig, chunkText, sleep };
