from __future__ import annotations

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.models import File
from app.storage import get_storage

PDF_CONTENT_TYPE = "application/pdf"


def ensure_pdf(upload: UploadFile) -> None:
    name = (upload.filename or "").lower()
    content_type = (upload.content_type or "").lower()
    if not name.endswith(".pdf") and content_type not in {PDF_CONTENT_TYPE, "application/x-pdf"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only PDF files are accepted ({upload.filename or 'unnamed'})",
        )


async def store_pdf(db: Session, key: str, upload: UploadFile) -> File:
    ensure_pdf(upload)
    data = await upload.read()
    if not data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty")
    storage = get_storage()
    storage.put_bytes(key, data, PDF_CONTENT_TYPE)
    record = File(
        storage_key=key,
        original_filename=upload.filename or key.split("/")[-1],
        content_type=PDF_CONTENT_TYPE,
        size_bytes=len(data),
    )
    db.add(record)
    db.flush()
    return record


def store_pdf_bytes(db: Session, key: str, data: bytes, filename: str) -> File:
    storage = get_storage()
    storage.put_bytes(key, data, PDF_CONTENT_TYPE)
    record = File(
        storage_key=key,
        original_filename=filename,
        content_type=PDF_CONTENT_TYPE,
        size_bytes=len(data),
    )
    db.add(record)
    db.flush()
    return record
