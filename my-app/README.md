# SQA Maths Study — Prototype

Front-end-only study resource for Scottish SQA Mathematics (National 5 and Higher).

## Running locally

```bash
pnpm install
pnpm dev
```

The dev server starts on `http://localhost:5173`.

## Adding real content

All mock data lives in **`src/data/content.ts`**. Swap any `SAMPLE_PDF` URL for the real hosted PDF path.

### Past papers

```ts
{ year: 2024, paperNumber: 1, paperUrl: "/pdfs/n5-2024-p1.pdf", solutionsUrl: "/pdfs/n5-2024-p1-solutions.pdf" }
```

### Topic workbooks

```ts
{ name: "Expanding Brackets", workbookUrl: "/pdfs/algebra-brackets.pdf", answersUrl: "/pdfs/algebra-brackets-answers.pdf" }
```

Place PDF files in `public/pdfs/` to serve them from the Vite root, or use absolute CDN/S3 URLs.

## Routes

| Path | Page |
|------|------|
| `/` | Level select (National 5 / Higher) |
| `/:level` | Mode select (Past Papers / By Topic) |
| `/:level/past-papers` | Papers grouped by year |
| `/:level/topics` | Topic grid |
| `/:level/topics/:topic` | Subtopic list with Workbook + Answers |

## Tech stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4
- React Router v7 (Data mode)
- react-pdf v10 (pdf.js) — lazy-loaded per modal open
