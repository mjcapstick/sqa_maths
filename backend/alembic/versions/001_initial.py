"""initial schema

Revision ID: 001_initial
Revises:
Create Date: 2026-09-08
"""

from alembic import op
import sqlalchemy as sa

revision = "001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "files",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("storage_key", sa.String(length=512), nullable=False, unique=True),
        sa.Column("original_filename", sa.String(length=255), nullable=False),
        sa.Column("content_type", sa.String(length=128), nullable=False),
        sa.Column("size_bytes", sa.Integer(), nullable=False),
        sa.Column("uploaded_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_table(
        "exam_levels",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("name", sa.String(length=128), nullable=False, unique=True),
        sa.Column("slug", sa.String(length=128), nullable=False, unique=True),
        sa.Column("sort_order", sa.Integer(), nullable=False),
    )
    op.create_table(
        "past_papers",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("exam_level_id", sa.String(length=36), sa.ForeignKey("exam_levels.id"), nullable=False),
        sa.Column("year", sa.Integer(), nullable=False),
        sa.Column("diet", sa.String(length=64), nullable=False),
        sa.Column("paper_number", sa.Integer(), nullable=False),
        sa.Column("paper_file_id", sa.String(length=36), sa.ForeignKey("files.id"), nullable=True),
        sa.Column("solutions_file_id", sa.String(length=36), sa.ForeignKey("files.id"), nullable=True),
        sa.UniqueConstraint("exam_level_id", "year", "diet", "paper_number", name="uq_past_paper_sitting"),
    )
    op.create_index("ix_past_papers_exam_level_id", "past_papers", ["exam_level_id"])
    op.create_table(
        "topics",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("exam_level_id", sa.String(length=36), sa.ForeignKey("exam_levels.id"), nullable=False),
        sa.Column("name", sa.String(length=128), nullable=False),
        sa.Column("slug", sa.String(length=128), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.UniqueConstraint("exam_level_id", "slug", name="uq_topic_level_slug"),
    )
    op.create_index("ix_topics_exam_level_id", "topics", ["exam_level_id"])
    op.create_index("ix_topics_slug", "topics", ["slug"])
    op.create_table(
        "subtopics",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("topic_id", sa.String(length=36), sa.ForeignKey("topics.id"), nullable=False),
        sa.Column("name", sa.String(length=128), nullable=False),
        sa.Column("slug", sa.String(length=128), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("workbook_file_id", sa.String(length=36), sa.ForeignKey("files.id"), nullable=True),
        sa.Column("answers_file_id", sa.String(length=36), sa.ForeignKey("files.id"), nullable=True),
        sa.UniqueConstraint("topic_id", "slug", name="uq_subtopic_topic_slug"),
    )
    op.create_index("ix_subtopics_topic_id", "subtopics", ["topic_id"])


def downgrade() -> None:
    op.drop_table("subtopics")
    op.drop_table("topics")
    op.drop_table("past_papers")
    op.drop_table("exam_levels")
    op.drop_table("files")
