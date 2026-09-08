from __future__ import annotations

import uuid
from datetime import datetime

from typing import Optional

from sqlalchemy import DateTime, ForeignKey, Integer, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def uuid_str() -> str:
    return str(uuid.uuid4())


class File(Base):
    __tablename__ = "files"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    storage_key: Mapped[str] = mapped_column(String(512), unique=True, nullable=False)
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    content_type: Mapped[str] = mapped_column(String(128), nullable=False, default="application/pdf")
    size_bytes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )


class ExamLevel(Base):
    __tablename__ = "exam_levels"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    name: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    past_papers: Mapped[list["PastPaper"]] = relationship(back_populates="exam_level")
    topics: Mapped[list["Topic"]] = relationship(back_populates="exam_level")


class PastPaper(Base):
    __tablename__ = "past_papers"
    __table_args__ = (
        UniqueConstraint(
            "exam_level_id",
            "year",
            "diet",
            "paper_number",
            name="uq_past_paper_sitting",
        ),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    exam_level_id: Mapped[str] = mapped_column(ForeignKey("exam_levels.id"), nullable=False, index=True)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    diet: Mapped[str] = mapped_column(String(64), nullable=False, default="May")
    paper_number: Mapped[int] = mapped_column(Integer, nullable=False)
    paper_file_id: Mapped[Optional[str]] = mapped_column(ForeignKey("files.id"), nullable=True)
    solutions_file_id: Mapped[Optional[str]] = mapped_column(ForeignKey("files.id"), nullable=True)

    exam_level: Mapped[ExamLevel] = relationship(back_populates="past_papers")
    paper_file: Mapped[Optional[File]] = relationship(foreign_keys=[paper_file_id])
    solutions_file: Mapped[Optional[File]] = relationship(foreign_keys=[solutions_file_id])


class Topic(Base):
    __tablename__ = "topics"
    __table_args__ = (UniqueConstraint("exam_level_id", "slug", name="uq_topic_level_slug"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    exam_level_id: Mapped[str] = mapped_column(ForeignKey("exam_levels.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    slug: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    exam_level: Mapped[ExamLevel] = relationship(back_populates="topics")
    subtopics: Mapped[list["Subtopic"]] = relationship(back_populates="topic")


class Subtopic(Base):
    __tablename__ = "subtopics"
    __table_args__ = (UniqueConstraint("topic_id", "slug", name="uq_subtopic_topic_slug"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    topic_id: Mapped[str] = mapped_column(ForeignKey("topics.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    slug: Mapped[str] = mapped_column(String(128), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    workbook_file_id: Mapped[Optional[str]] = mapped_column(ForeignKey("files.id"), nullable=True)
    answers_file_id: Mapped[Optional[str]] = mapped_column(ForeignKey("files.id"), nullable=True)

    topic: Mapped[Topic] = relationship(back_populates="subtopics")
    workbook_file: Mapped[Optional[File]] = relationship(foreign_keys=[workbook_file_id])
    answers_file: Mapped[Optional[File]] = relationship(foreign_keys=[answers_file_id])
