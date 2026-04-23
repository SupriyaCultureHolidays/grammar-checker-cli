# grammar-checker-cli

Scans configured routes of a live website for grammar/spelling issues and generates a CSV report.

## Install

### Option A — Local (within a project)
```bash
npm install --save-dev /path/to/grammar-checker-cli
# or publish to npm, then:
npm install --save-dev grammar-checker-cli
```

### Option B — Global
```bash
npm install -g /path/to/grammar-checker-cli
```

## Setup in any MERN project

1. Add `grammar.config.json` to the project root:

```json
{
  "baseUrl": "https://your-live-site.com",
  "routes": ["/", "/about", "/contact"],
  "output": "./grammar-report.csv",
  "chunkSize": 4000,
  "delayMs": 500
}
```

2. Add the script to the project's `package.json`:

```json
"scripts": {
  "grammar-check": "grammar-check"
}
```

3. Run:

```bash
npm run grammar-check
```

## Config Options

| Field       | Type     | Description                                      |
|-------------|----------|--------------------------------------------------|
| `baseUrl`   | string   | Base URL of the live site                        |
| `routes`    | string[] | List of routes to scan                           |
| `output`    | string   | Output CSV file path                             |
| `chunkSize` | number   | Max characters per LanguageTool API request      |
| `delayMs`   | number   | Delay (ms) between API calls to respect limits   |

## Output

A CSV file with columns: `URL`, `Wrong Text`, `Suggestion`, `Sentence`

## Development (run directly)

```bash
cd grammar-checker-cli
npm install
node index.js
```
