# Interview Practice Cards

Static flip cards for **Data Analytics** and **Data Science** interview prep. Read the question, say an answer out loud, flip, compare. There is a short guided answer, sometimes extra notes, sometimes a code snippet. It is not a mock interview with a person, but it is a low friction way to drill when you have a small slice of time or one topic keeps bugging you.

The app runs in the browser. Progress, language, and theme sit in `localStorage` on your machine. No login, no backend for the questions.

Use it online at [https://laurash96.github.io/ds-da-interview-prep/](https://laurash96.github.io/ds-da-interview-prep/) if you only want to practice. No install.

If you fork or clone to change JSON banks or the UI, run a small static server on your machine (commands below) or turn on GitHub Pages on your fork so you get your own URL.

If you care about spaced practice across SQL, Python, ML, stats, product style questions, GenAI, and soft skills, this layout might fit. Same if you do not want to install a stack just to review cards.

You get tabs and search, filters for difficulty and card status, EN/ES content and UI, three color themes, optional learning path (easier cards first), and keyboard shortcuts for prev/next/flip/shuffle.

## Local static server

From the repo root:

Python:

```bash
cd path/to/Interview-Preparation
python3 -m http.server 5173
```

Then open `http://localhost:5173` (or whatever port you picked).

Node:

```bash
npx serve .
```

Blank page or old data after edits: hard refresh (`Cmd+Shift+R` or `Ctrl+Shift+R`) helps with cached JS or JSON.

## Project layout

| Path | Role |
|------|------|
| `index.html` | Page shell |
| `styles.css` | Styles and themes |
| `app.js` | Loads banks, filters, progress, i18n, flip card |
| `data/banks/*.json` | Question banks per topic |
| `data/questions.json` | Older sample file; live banks are under `data/banks/` (`QUESTION_BANK_URLS` in `app.js`) |
| `scripts/enrich_questions.py` | Optional helper if you batch edit card text in JSON |
| `scripts/patch_softskills_examples.py` | Small one off patch script, safe to delete |

## GitHub Pages

The live site at [laurash96.github.io/ds-da-interview-prep](https://laurash96.github.io/ds-da-interview-prep/) is a normal GitHub Pages deploy from this project (static files from `/` on `main`).

For your own fork: push, then open Settings, Pages, choose deploy from branch `main` at `/` (root). Wait for the site URL GitHub shows you. No backend, same idea as local, only hosted.

## JSON shape for one card

Fields you will touch most: `id`, `category`, `difficulty`, `tags`, `company`, paired `question_en` / `question_es`, `answer_en` / `answer_es`, optional `theory_en` / `theory_es`, optional `code` as a list of `{ "lang": "sql", "snippet": "..." }`, and optional `source`.

Example:

```json
{
  "id": "sql-e-001",
  "category": "SQL",
  "difficulty": "Easy",
  "company": ["General"],
  "tags": ["where", "having"],
  "question_en": "What's the difference between WHERE and HAVING?",
  "question_es": "¿Cuál es la diferencia entre WHERE y HAVING?",
  "answer_en": "…",
  "answer_es": "…",
  "theory_en": "…",
  "theory_es": "…",
  "code": [],
  "source": { "label": "Original", "url": "" }
}
```

Reload after JSON edits. Hard refresh if the browser clings to old files.

## Learning path

Open Filters and turn on **Learning path**. The app keeps **Easy** in front, then opens **Medium** and **Hard** as you mark enough easier cards as **Known**. Less noise than seeing every hard card on day one.

## Privacy note

`localStorage` holds progress keyed by card id plus your UI prefs. Clear site data or use another browser and that history is gone unless you build your own export path someday.

## Forks and changes

Copy a row in the right bank JSON, give it a new `id`, rewrite the text, reload. Same schema means you rarely need to change `app.js`.

Feel free to fork, remix the banks for how you study, or send a PR with tighter wording, more cards, a11y fixes, or readme tweaks. All of that helps.
