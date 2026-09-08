from __future__ import annotations

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.deps import require_admin
from app.models import PastPaper
from app.routers.exam_levels import get_level_or_404
from app.schemas import PastPaperOut
from app.uploads import store_pdf

router = APIRouter(tags=["past-papers"])


@router.get("/api/exam-levels/{slug}/past-papers", response_model=list[PastPaperOut])
def list_past_papers(slug: str, db: Session = Depends(get_db)) -> list[PastPaper]:
    level = get_level_or_404(db, slug)
    papers = db.scalars(
        select(PastPaper)
        .where(PastPaper.exam_level_id == level.id)
        .options(joinedload(PastPaper.paper_file), joinedload(PastPaper.solutions_file))
        .order_by(PastPaper.year.desc(), PastPaper.diet, PastPaper.paper_number)
    )
    return list(papers.unique())


@router.post(
    "/api/exam-levels/{slug}/past-papers",
    response_model=PastPaperOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
async def create_past_paper(
    slug: str,
    year: int = Form(...),
    diet: str = Form("May"),
    paper_number: int = Form(...),
    paper: UploadFile = File(...),
    solutions: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> PastPaper:
    level = get_level_or_404(db, slug)
    existing = db.scalar(
        select(PastPaper).where(
            PastPaper.exam_level_id == level.id,
            PastPaper.year == year,
            PastPaper.diet == diet,
            PastPaper.paper_number == paper_number,
        )
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="That paper already exists")

    stem = f"{year}-paper-{paper_number}"
    diet_slug = diet.lower().replace(" ", "-")
    if diet_slug not in {"may", ""}:
        stem = f"{year}-{diet_slug}-paper-{paper_number}"
    base = f"{level.slug}/past-papers/{stem}"

    paper_file = await store_pdf(db, f"{base}.pdf", paper)
    solutions_file = await store_pdf(db, f"{base}-solutions.pdf", solutions)
    record = PastPaper(
        exam_level_id=level.id,
        year=year,
        diet=diet,
        paper_number=paper_number,
        paper_file_id=paper_file.id,
        solutions_file_id=solutions_file.id,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    db.refresh(record, attribute_names=["paper_file", "solutions_file"])
    return record
