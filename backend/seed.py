"""Seed exam levels, topics, subtopics, and placeholder PDFs."""

from __future__ import annotations

import io
from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from sqlalchemy import select

from app.database import SessionLocal
from app.models import ExamLevel, PastPaper, Subtopic, Topic
from app.uploads import store_pdf_bytes

ROOT = Path(__file__).resolve().parent


TOPICS = [
    (
        "Algebra",
        "algebra",
        [
            ("Expressions & formulae", "expressions"),
            ("Quadratics", "quadratics"),
            ("Simultaneous equations", "simultaneous-equations"),
        ],
    ),
    (
        "Trigonometry",
        "trigonometry",
        [
            ("SOH CAH TOA", "soh-cah-toa"),
            ("Exact values", "exact-values"),
            ("Trigonometric equations", "trig-equations"),
        ],
    ),
    (
        "Geometry",
        "geometry",
        [
            ("Circle geometry", "circle"),
            ("Vectors", "vectors"),
            ("Similar shapes", "similar-shapes"),
        ],
    ),
    (
        "Statistics",
        "statistics",
        [
            ("Averages & spread", "averages"),
            ("Scatter graphs", "scatter-graphs"),
            ("Probability", "probability"),
        ],
    ),
]

HIGHER_EXTRA = [
    (
        "Calculus",
        "calculus",
        [
            ("Differentiation", "differentiation"),
            ("Integration", "integration"),
        ],
    ),
]

PAPERS = [
    (2023, "May", 1),
    (2023, "May", 2),
    (2022, "May", 1),
    (2022, "May", 2),
]


def placeholder_pdf(title: str, subtitle: str) -> bytes:
    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    pdf.setFillColorRGB(0.11, 0.11, 0.12)
    pdf.setFont("Times-Bold", 22)
    pdf.drawString(25 * mm, height - 40 * mm, title)
    pdf.setFont("Times-Roman", 13)
    pdf.drawString(25 * mm, height - 52 * mm, subtitle)
    pdf.setStrokeColorRGB(0.31, 0.27, 0.90)
    pdf.setLineWidth(2)
    pdf.line(25 * mm, height - 58 * mm, width - 25 * mm, height - 58 * mm)
    pdf.setFont("Times-Roman", 11)
    pdf.setFillColorRGB(0.35, 0.35, 0.38)
    pdf.drawString(25 * mm, height - 72 * mm, "Placeholder PDF for the prototype. Replace via the admin upload page.")
    pdf.showPage()
    pdf.save()
    return buffer.getvalue()


def seed() -> None:
    db = SessionLocal()
    try:
        if db.scalar(select(ExamLevel).limit(1)):
            print("Database already seeded — skipping.")
            return

        n5 = ExamLevel(name="National 5", slug="national-5", sort_order=1)
        higher = ExamLevel(name="Higher", slug="higher", sort_order=2)
        db.add_all([n5, higher])
        db.flush()

        for level in (n5, higher):
            topic_defs = list(TOPICS)
            if level.slug == "higher":
                topic_defs = topic_defs + HIGHER_EXTRA
            for t_order, (t_name, t_slug, subs) in enumerate(topic_defs, start=1):
                topic = Topic(exam_level_id=level.id, name=t_name, slug=t_slug, sort_order=t_order)
                db.add(topic)
                db.flush()
                for s_order, (s_name, s_slug) in enumerate(subs, start=1):
                    prefix = f"{level.slug}/topics/{t_slug}/{s_slug}"
                    workbook = store_pdf_bytes(
                        db,
                        f"{prefix}-workbook.pdf",
                        placeholder_pdf(f"{level.name} · {t_name}", f"Workbook — {s_name}"),
                        f"{s_slug}-workbook.pdf",
                    )
                    answers = store_pdf_bytes(
                        db,
                        f"{prefix}-answers.pdf",
                        placeholder_pdf(f"{level.name} · {t_name}", f"Answers — {s_name}"),
                        f"{s_slug}-answers.pdf",
                    )
                    db.add(
                        Subtopic(
                            topic_id=topic.id,
                            name=s_name,
                            slug=s_slug,
                            sort_order=s_order,
                            workbook_file_id=workbook.id,
                            answers_file_id=answers.id,
                        )
                    )

            for year, diet, paper_number in PAPERS:
                stem = f"{year}-paper-{paper_number}"
                base = f"{level.slug}/past-papers/{stem}"
                paper_file = store_pdf_bytes(
                    db,
                    f"{base}.pdf",
                    placeholder_pdf(f"{level.name} Mathematics", f"{year} {diet} · Paper {paper_number}"),
                    f"{stem}.pdf",
                )
                solutions_file = store_pdf_bytes(
                    db,
                    f"{base}-solutions.pdf",
                    placeholder_pdf(f"{level.name} Mathematics", f"{year} {diet} · Paper {paper_number} solutions"),
                    f"{stem}-solutions.pdf",
                )
                db.add(
                    PastPaper(
                        exam_level_id=level.id,
                        year=year,
                        diet=diet,
                        paper_number=paper_number,
                        paper_file_id=paper_file.id,
                        solutions_file_id=solutions_file.id,
                    )
                )

        db.commit()
        print("Seeded National 5 and Higher with topics, subtopics, and placeholder papers.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
