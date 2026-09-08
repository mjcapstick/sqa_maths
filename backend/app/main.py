from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import exam_levels, files, past_papers, topics

settings = get_settings()

app = FastAPI(
    title="SQA Maths Papers API",
    description="Past papers and topic workbooks for Scottish secondary maths.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition", "Content-Type"],
)

app.include_router(exam_levels.router)
app.include_router(past_papers.router)
app.include_router(topics.router)
app.include_router(files.router)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
