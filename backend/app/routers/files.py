from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models import File
from app.schemas import SignedUrlOut
from app.storage import get_storage

router = APIRouter(prefix="/api/files", tags=["files"])


@router.get("/{file_id}/url", response_model=SignedUrlOut)
def get_signed_url(file_id: str, db: Session = Depends(get_db)) -> SignedUrlOut:
    file = db.get(File, file_id)
    if file is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
    settings = get_settings()
    storage = get_storage()
    url = storage.signed_url(
        file.storage_key,
        file.original_filename,
        settings.signed_url_expires_seconds,
        file_id=file.id,
    )
    return SignedUrlOut(
        url=url,
        expires_in=settings.signed_url_expires_seconds,
        filename=file.original_filename,
        content_type=file.content_type,
    )


@router.get("/{file_id}/content")
def get_local_content(
    file_id: str,
    expires: int = Query(...),
    token: str = Query(...),
    db: Session = Depends(get_db),
) -> Response:
    """Serves bytes for local-disk storage only. R2 clients never hit this."""
    settings = get_settings()
    if settings.storage_backend.lower() != "local":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    storage = get_storage()
    if not storage.verify_local_token(file_id, expires, token):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Link expired or invalid")
    file = db.get(File, file_id)
    if file is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
    data = storage.read_bytes(file.storage_key)  # type: ignore[union-attr]
    return Response(
        content=data,
        media_type=file.content_type,
        headers={
            "Content-Disposition": f'inline; filename="{file.original_filename}"',
            "Cache-Control": "private, max-age=60",
        },
    )
