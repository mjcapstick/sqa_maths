from __future__ import annotations

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.deps import require_admin
from app.models import Subtopic, Topic
from app.routers.exam_levels import get_level_or_404
from app.schemas import SubtopicOut, TopicCreate, TopicOut
from app.uploads import store_pdf
from app.utils import slugify

router = APIRouter(tags=["topics"])


def _topic_out(topic: Topic, subtopic_count: int) -> TopicOut:
    return TopicOut(
        id=topic.id,
        name=topic.name,
        slug=topic.slug,
        sort_order=topic.sort_order,
        exam_level_slug=topic.exam_level.slug,
        subtopic_count=subtopic_count,
    )


@router.get("/api/exam-levels/{slug}/topics", response_model=list[TopicOut])
def list_topics(slug: str, db: Session = Depends(get_db)) -> list[TopicOut]:
    level = get_level_or_404(db, slug)
    counts = dict(
        db.execute(
            select(Subtopic.topic_id, func.count())
            .join(Topic, Topic.id == Subtopic.topic_id)
            .where(Topic.exam_level_id == level.id)
            .group_by(Subtopic.topic_id)
        ).all()
    )
    topics = db.scalars(
        select(Topic)
        .where(Topic.exam_level_id == level.id)
        .options(joinedload(Topic.exam_level))
        .order_by(Topic.sort_order, Topic.name)
    )
    return [_topic_out(topic, counts.get(topic.id, 0)) for topic in topics]


@router.post("/api/topics", response_model=TopicOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def create_topic(payload: TopicCreate, db: Session = Depends(get_db)) -> TopicOut:
    level = get_level_or_404(db, payload.exam_level_slug)
    slug = payload.slug or slugify(payload.name)
    existing = db.scalar(select(Topic).where(Topic.exam_level_id == level.id, Topic.slug == slug))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Topic slug already exists for this level")
    topic = Topic(exam_level_id=level.id, name=payload.name, slug=slug, sort_order=payload.sort_order)
    db.add(topic)
    db.commit()
    db.refresh(topic)
    topic.exam_level = level
    return _topic_out(topic, 0)


def resolve_topic(db: Session, slug: str, exam_level: str | None) -> Topic:
    stmt = select(Topic).options(joinedload(Topic.exam_level)).where(Topic.slug == slug)
    if exam_level:
        level = get_level_or_404(db, exam_level)
        stmt = stmt.where(Topic.exam_level_id == level.id)
    topics = list(db.scalars(stmt))
    if not topics:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found")
    if len(topics) > 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Topic slug is used at more than one exam level; pass exam_level",
        )
    return topics[0]


@router.get("/api/topics/{slug}/subtopics", response_model=list[SubtopicOut])
def list_subtopics(
    slug: str,
    exam_level: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> list[Subtopic]:
    topic = resolve_topic(db, slug, exam_level)
    subtopics = db.scalars(
        select(Subtopic)
        .where(Subtopic.topic_id == topic.id)
        .options(joinedload(Subtopic.workbook_file), joinedload(Subtopic.answers_file))
        .order_by(Subtopic.sort_order, Subtopic.name)
    )
    return list(subtopics.unique())


@router.get("/api/topics/{slug}", response_model=TopicOut)
def get_topic(
    slug: str,
    exam_level: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> TopicOut:
    topic = resolve_topic(db, slug, exam_level)
    count = db.scalar(select(func.count()).select_from(Subtopic).where(Subtopic.topic_id == topic.id)) or 0
    return _topic_out(topic, count)


@router.post(
    "/api/topics/{slug}/subtopics",
    response_model=SubtopicOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
async def create_subtopic(
    slug: str,
    name: str = Form(...),
    subtopic_slug: str | None = Form(default=None),
    sort_order: int = Form(default=0),
    exam_level: str | None = Form(default=None),
    workbook: UploadFile = File(...),
    answers: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> Subtopic:
    topic = resolve_topic(db, slug, exam_level)
    st_slug = subtopic_slug or slugify(name)
    existing = db.scalar(select(Subtopic).where(Subtopic.topic_id == topic.id, Subtopic.slug == st_slug))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Subtopic already exists")

    prefix = f"{topic.exam_level.slug}/topics/{topic.slug}/{st_slug}"
    workbook_file = await store_pdf(db, f"{prefix}-workbook.pdf", workbook)
    answers_file = await store_pdf(db, f"{prefix}-answers.pdf", answers)
    record = Subtopic(
        topic_id=topic.id,
        name=name,
        slug=st_slug,
        sort_order=sort_order,
        workbook_file_id=workbook_file.id,
        answers_file_id=answers_file.id,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    db.refresh(record, attribute_names=["workbook_file", "answers_file"])
    return record
