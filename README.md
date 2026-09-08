# SQA Maths papers

Prototype site for Scottish secondary maths students to find past papers and practise by topic.

## Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind, TanStack Query, React Router, react-pdf
- **Backend:** FastAPI, SQLAlchemy, Alembic, Pydantic
- **Database:** SQLite (swap `DATABASE_URL` for Postgres later — no model changes)
- **Files:** Cloudflare R2, or local disk while developing

## Quick start

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
python seed.py
uvicorn app.main:app --reload --port 8000
```

API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

`seed.py` is idempotent: it no-ops if exam levels already exist. It creates **National 5** and **Higher**, topics (Algebra, Trigonometry, Geometry, Statistics, plus Calculus on Higher), subtopics, and placeholder PDFs for a few past papers.

### Frontend

Needs Node 18+. From the repo root:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Vite proxies `/api` to the backend on port 8000.

Internal upload UI (unauthenticated, prototype only): [http://localhost:5173/admin](http://localhost:5173/admin)

## Storage

`STORAGE_BACKEND` in `backend/.env`:

| Value | Behaviour |
| --- | --- |
| `local` (default) | PDFs written under `LOCAL_STORAGE_DIR` (default `./storage`). `GET /api/files/{id}/url` returns a short-lived HMAC URL that the API serves from disk. |
| `r2` | Uploads go to the configured R2 bucket. The same endpoint returns an S3 presigned URL. Credentials stay on the server. |

### R2 environment variables

```
STORAGE_BACKEND=r2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
R2_ENDPOINT_URL=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

Allow CORS GET from `http://localhost:5173` on the bucket so the in-browser PDF preview can fetch presigned objects.

Object keys look like:

```
national-5/past-papers/2023-paper-1.pdf
national-5/past-papers/2023-paper-1-solutions.pdf
higher/topics/algebra/quadratics-workbook.pdf
higher/topics/algebra/quadratics-answers.pdf
```

## Adding another exam level

`POST /api/exam-levels` with `{ "name": "Advanced Higher" }` (or use the upload page). Topics, papers, and routes are keyed by slug — no frontend or backend code changes required.

Write routes already depend on `require_admin` in `backend/app/deps.py`. Replace that function with a real auth check when you lock the prototype down.
