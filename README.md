# grammar-checker-cli

A reusable CLI tool that scans configured routes of any live website for grammar and spelling issues, then generates a detailed CSV report. Built for internal use across multiple MERN projects.

---

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

## What This Tool Does

- Opens each route of your live website using **Puppeteer** (headless browser)
- Extracts all visible text from the page
- Sends the text to the **LanguageTool public API** for grammar and spelling analysis
- Collects all issues found (wrong word, suggestion, context sentence)
- Generates a **CSV report** with all issues listed by URL

---

## Project Structure

```
grammar-checker-cli/
 ├── index.js              ← Entry point, runs the full flow
 ├── lib/
 │    ├── scraper.js       ← Puppeteer: opens pages, extracts text
 │    ├── checker.js       ← LanguageTool API: checks grammar, deduplicates
 │    ├── csv.js           ← Writes final CSV report
 │    └── utils.js         ← Config loader, text chunker, sleep helper
 ├── grammar.config.json   ← Your site config (baseUrl + routes)
 ├── package.json
 └── README.md
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

Open the auto-created `grammar.config.json` in your project root and update it:

```json
{
  "baseUrl": "https://your-live-site.com",
  "routes": [
    "/",
    "/about",
    "/contact",
    "/services",
    "/blog"
  ],
  "output": "./grammar-report.csv",
  "chunkSize": 4000,
  "delayMs": 500
}
```

| Field       | Type     | Description                                         |
|-------------|----------|-----------------------------------------------------|
| `baseUrl`   | string   | Base URL of your live site (no trailing slash)      |
| `routes`    | string[] | List of routes to scan (add as many as you need)    |
| `output`    | string   | Output CSV file path (relative to your project)     |
| `chunkSize` | number   | Max characters per LanguageTool API request         |
| `delayMs`   | number   | Delay in ms between API calls (avoids rate limits)  |

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

### Step 6 — Check the report

A `grammar-report.csv` file will be created in your project root.

Console output will look like:

```
Checking: /
  Found 3 issues
Checking: /about
  Found 1 issues
Checking: /contact
  Found 0 issues

Report generated at: ./grammar-report.csv
```

---

## CSV Report Output

The generated `grammar-report.csv` will have the following columns:

| URL | Wrong Text | Suggestion | Sentence |
|-----|------------|------------|----------|
| https://your-site.com/ | recieve | receive | We recieve your order... |
| https://your-site.com/about | teh | the | teh team is ready... |
| https://your-site.com/contact | adress | address | Enter your adress below... |

---

## How Routes Work

Routes are **not hardcoded** — they come entirely from your `grammar.config.json`.

- Add as many routes as you want in the `routes` array
- The tool combines `baseUrl + route` for each page
- Example: `baseUrl = https://mysite.com` + route `/about` → scans `https://mysite.com/about`

```json
"routes": [
  "/",
  "/about",
  "/contact",
  "/services",
  "/blog",
  "/faq",
  "/pricing"
]
```

Each route will be scanned one by one and all issues will appear in the final CSV.

---

## Error Handling

The tool handles the following gracefully without crashing:

| Situation | What Happens |
|-----------|--------------|
| `grammar.config.json` missing | Auto-creates it and exits with instructions |
| Invalid JSON in config | Shows clear error message |
| Page fails to load | Skips that route, continues with next |
| Page has no text content | Skips that route, continues with next |
| LanguageTool API fails | Retries 2 times, then skips that chunk |
| Puppeteer timeout | Skips that route with error message |

---

## Run Directly (without installing in another project)

If you want to test the tool standalone:

```bash
git clone https://github.com/SupriyaCultureHolidays/grammar-checker-cli.git
cd grammar-checker-cli
npm install
```

Update `grammar.config.json` with your real site:

```json
{
  "baseUrl": "https://your-live-site.com",
  "routes": ["/", "/about", "/contact"],
  "output": "./grammar-report.csv",
  "chunkSize": 4000,
  "delayMs": 500
}
```

Then run:

```bash
node index.js
```

---

## Requirements

- Node.js v16 or higher
- Your website must be **live and publicly accessible**
- No authentication supported — only public pages can be scanned

---

## Dependencies

| Package       | Purpose                              |
|---------------|--------------------------------------|
| `puppeteer`   | Headless browser to scrape pages     |
| `axios`       | HTTP requests to LanguageTool API    |
| `csv-writer`  | Generate CSV report                  |
