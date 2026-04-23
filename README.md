# grammar-checker-cli

Scans configured routes of a live website for grammar/spelling issues and generates a CSV report.

## How It Works

```
GitHub (this tool)
      ↓
npm install --save-dev github:SupriyaCultureHolidays/grammar-checker-cli
      ↓
grammar.config.json auto-created in your project root
      ↓
Update baseUrl and routes
      ↓
npm run grammar-check
      ↓
grammar-report.csv ✅
```

---

## Setup in Any MERN Project

### Step 1 — Go to your MERN project root

```bash
cd /path/to/your-mern-project
```

### Step 2 — Install the tool

```bash
npm install --save-dev github:SupriyaCultureHolidays/grammar-checker-cli
```

> ✅ This will **automatically create** a `grammar.config.json` file in your project root.
> 👉 You just need to **update** `baseUrl` and `routes` — no need to create it manually.

### Step 3 — Update `grammar.config.json` with your site details

```json
{
  "baseUrl": "https://your-live-site.com",
  "routes": [
    "/",
    "/about",
    "/contact"
  ],
  "output": "./grammar-report.csv",
  "chunkSize": 4000,
  "delayMs": 500
}
```

### Step 4 — Add script to your project's `package.json`

```json
"scripts": {
  "grammar-check": "grammar-check"
}
```

### Step 5 — Run

```bash
npm run grammar-check
```

Console output:
```
Checking: /
  Found 3 issues
Checking: /about
  Found 1 issues

Report generated at: ./grammar-report.csv
```

A `grammar-report.csv` file will be created in your project root. ✅

---

## Config Options

| Field       | Type     | Description                                    |
|-------------|----------|------------------------------------------------|
| `baseUrl`   | string   | Base URL of your live site                     |
| `routes`    | string[] | List of routes to scan                         |
| `output`    | string   | Output CSV file path                           |
| `chunkSize` | number   | Max characters per LanguageTool API request    |
| `delayMs`   | number   | Delay (ms) between API calls                   |

---

## CSV Output

| URL | Wrong Text | Suggestion | Sentence |
|-----|------------|------------|----------|
| https://your-site.com/about | recieve | receive | We recieve your order... |

---

## Run Directly (without installing in another project)

```bash
git clone https://github.com/SupriyaCultureHolidays/grammar-checker-cli.git
cd grammar-checker-cli
npm install
```

Update `grammar.config.json` with your site, then:

```bash
node index.js
```
