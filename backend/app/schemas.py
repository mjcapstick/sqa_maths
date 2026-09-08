from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class FileOut(ORMModel):
    id: str
    original_filename: str
    content_type: str
    size_bytes: int
    uploaded_at: datetime


class SignedUrlOut(BaseModel):
    url: str
    expires_in: int
    filename: str
    content_type: str


class ExamLevelOut(ORMModel):
    id: str
    name: str
    slug: str
    sort_order: int


class ExamLevelCreate(BaseModel):
    name: str = Field(min_length=1, max_length=128)
    slug: str | None = Field(default=None, max_length=128)
    sort_order: int = 0


class PastPaperOut(ORMModel):
    id: str
    year: int
    diet: str
    paper_number: int
    paper_file: FileOut | None = None
    solutions_file: FileOut | None = None


class TopicOut(ORMModel):
    id: str
    name: str
    slug: str
    sort_order: int
    exam_level_slug: str
    subtopic_count: int = 0


class TopicCreate(BaseModel):
    exam_level_slug: str
    name: str = Field(min_length=1, max_length=128)
    slug: str | None = Field(default=None, max_length=128)
    sort_order: int = 0


class SubtopicOut(ORMModel):
    id: str
    name: str
    slug: str
    sort_order: int
    workbook_file: FileOut | None = None
    answers_file: FileOut | None = None


class SubtopicCreateMeta(BaseModel):
    name: str = Field(min_length=1, max_length=128)
    slug: str | None = None
    sort_order: int = 0
