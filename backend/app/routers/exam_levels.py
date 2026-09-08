from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import require_admin
from app.models import ExamLevel
from app.schemas import ExamLevelCreate, ExamLevelOut
from app.utils import slugify

router = APIRouter(prefix="/api/exam-levels", tags=["exam-levels"])


@router.get("", response_model=list[ExamLevelOut])
def list_exam_levels(db: Session = Depends(get_db)) -> list[ExamLevel]:
    return list(db.scalars(select(ExamLevel).order_by(ExamLevel.sort_order, ExamLevel.name)))


@router.post("", response_model=ExamLevelOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def create_exam_level(payload: ExamLevelCreate, db: Session = Depends(get_db)) -> ExamLevel:
    slug = payload.slug or slugify(payload.name)
    existing = db.scalar(select(ExamLevel).where(ExamLevel.slug == slug))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Exam level slug already exists")
    if payload.sort_order == 0:
        max_order = db.scalar(select(func.max(ExamLevel.sort_order))) or 0
        sort_order = max_order + 1
    else:
        sort_order = payload.sort_order
    level = ExamLevel(name=payload.name, slug=slug, sort_order=sort_order)
    db.add(level)
    db.commit()
    db.refresh(level)
    return level


def get_level_or_404(db: Session, slug: str) -> ExamLevel:
    level = db.scalar(select(ExamLevel).where(ExamLevel.slug == slug))
    if level is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam level not found")
    return level


@router.get("/{slug}", response_model=ExamLevelOut)
def get_exam_level(slug: str, db: Session = Depends(get_db)) -> ExamLevel:
    return get_level_or_404(db, slug)
