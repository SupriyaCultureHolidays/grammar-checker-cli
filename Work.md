# How to Use grammar-checker-cli in Any Project

## Flow

```
Your MERN Project
      ↓
npm install --save-dev github:SupriyaCultureHolidays/grammar-checker-cli
      ↓
grammar.config.json auto-created in your project root
      ↓
Set htmlDir to your frontend folder
      ↓
npm run grammar-check
      ↓
grammar-report.csv ✅
```

---

## Step 1 — Go to your project root

```bash
cd /path/to/your-mern-project
```

---

## Step 2 — Install the tool

```bash
npm install --save-dev github:SupriyaCultureHolidays/grammar-checker-cli
```

This will automatically:
- Create `grammar.config.json` in your project root
- Add `"grammar-check": "grammar-check"` script to your `package.json`

---

## Step 3 — Update `grammar.config.json`

Open the auto-created `grammar.config.json` and set `htmlDir` to your frontend folder:

```json
{
  "htmlDir": "./client/src",
  "output": "./grammar-report.csv",
  "chunkSize": 4000,
  "delayMs": 500
}
```

| Field       | Description                                              |
|-------------|----------------------------------------------------------|
| `htmlDir`   | Path to your frontend folder that contains `.html` files |
| `output`    | Where to save the CSV report                             |
| `chunkSize` | Max characters per API request (default 4000)            |
| `delayMs`   | Delay between API calls to avoid rate limits (default 500ms) |

### Common `htmlDir` values by project type

| Project Type     | Typical `htmlDir`          |
|------------------|----------------------------|
| React (CRA)      | `./src`                    |
| React (Vite)     | `./src`                    |
| Plain HTML site  | `./src` or `./pages`       |
| Express + views  | `./views`                  |
| Next.js          | `./src` or `./pages`       |

---

## Step 4 — Run

```bash
npm run grammar-check
```

---

## Step 5 — Check the report

A `grammar-report.csv` file will be created in your project root.

Console output will look like:

```
Checking: src/index.html
  Found 3 issues
Checking: src/about.html
  Found 1 issues
Checking: src/contact.html
  Found 0 issues

Report generated at: ./grammar-report.csv
```

---

## CSV Report Columns

| File | Wrong Text | Suggestion | Sentence |
|------|------------|------------|----------|
| src/index.html | recieve | receive | We recieve your order... |
| src/about.html | teh | the | teh team is ready... |
| src/contact.html | adress | address | Enter your adress below... |

---

## What Gets Checked

The tool recursively scans all `.html`, `.js`, `.jsx`, `.ts`, `.tsx` files inside `htmlDir` and checks:

- All visible text content (headings, paragraphs, buttons, links, labels)
- `alt` attributes on images
- `placeholder` attributes on inputs
- `title` and `aria-label` attributes
- Skips `<script>`, `<style>` blocks and dynamic JSX expressions like `{variable}`

---

## Error Handling

| Situation | What Happens |
|-----------|--------------|
| `grammar.config.json` missing | Auto-created on install |
| `htmlDir` folder not found | Shows error and exits |
| HTML file has no text | Skips that file, continues |
| LanguageTool API fails | Retries 2 times, then skips |
| Invalid JSON in config | Shows clear error message |

---

## Requirements

- Node.js v16 or higher
- Internet connection (uses LanguageTool public API)
- No live site needed — works entirely on local HTML files
