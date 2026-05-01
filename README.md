# Interview Practice Cards (Data Analytics / Data Science)

A static HTML/CSS/JS app to practice interviews with **flip cards**, topic tabs, and a JSON question bank. The UI supports **English (default)** and **Spanish** via a language toggle.

## Run locally

- Option 1 (Python):

```bash
python3 -m http.server 5173
```

Then open `http://localhost:5173`.

- Option 2 (Node):

```bash
npx serve .
```

## Project structure

- `index.html`: main UI (tabs, filters, card)
- `styles.css`: styles
- `app.js`: logic (question loading, filters, progress via localStorage, language toggle)
- `data/questions.json`: question bank

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. In GitHub: **Settings → Pages**
3. Source: **Deploy from a branch**
4. Branch: `main` and folder `/ (root)`
5. Save and wait for the public URL.

## Question format

Edit `data/questions.json`. Each item supports theory and code snippets. For bilingual content, add `*_en` and `*_es` fields.

```json
{
  "id": "sql-001",
  "category": "SQL",
  "difficulty": "Easy",
  "company": ["General"],
  "tags": ["joins", "aggregation"],
  "question_en": "…",
  "question_es": "…",
  "answer_en": "…",
  "answer_es": "…",
  "theory_en": "…",
  "theory_es": "…",
  "code": [
    { "lang": "sql", "snippet": "SELECT …" }
  ],
  "source": { "label": "Internal", "url": "" }
}
```

## Incremental difficulty (Learning Path)

In the **Filters** modal, enable **Learning path**. The app will:

- Start with **Easy**
- Unlock **Medium** after you mark ~70% of Easy questions as **Known**
- Unlock **Hard** after you mark ~70% of Medium questions as **Known**

This makes practice feel incremental and less overwhelming.

