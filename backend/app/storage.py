from __future__ import annotations

import hashlib
import hmac
import time
from pathlib import Path
from typing import Protocol

import boto3
from botocore.client import Config
from fastapi import HTTPException, status

from app.config import Settings, get_settings


class StorageBackend(Protocol):
    def put_bytes(self, key: str, data: bytes, content_type: str) -> None: ...
    def signed_url(self, key: str, filename: str, expires_in: int) -> str: ...
    def verify_local_token(self, file_id: str, expires: int, token: str) -> bool: ...


class LocalStorage:
    def __init__(self, root: Path, secret_key: str, public_base: str) -> None:
        self.root = root
        self.secret_key = secret_key.encode()
        self.public_base = public_base.rstrip("/")
        self.root.mkdir(parents=True, exist_ok=True)

    def put_bytes(self, key: str, data: bytes, content_type: str) -> None:
        path = self.root / key
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)

    def _sign(self, file_id: str, expires: int) -> str:
        message = f"{file_id}:{expires}".encode()
        return hmac.new(self.secret_key, message, hashlib.sha256).hexdigest()

    def signed_url(self, key: str, filename: str, expires_in: int, file_id: str | None = None) -> str:
        # Local URLs are served by the API; file_id is required for the token.
        if not file_id:
            raise HTTPException(status_code=500, detail="Local signed URLs require a file id")
        expires = int(time.time()) + expires_in
        token = self._sign(file_id, expires)
        return f"{self.public_base}/api/files/{file_id}/content?expires={expires}&token={token}"

    def verify_local_token(self, file_id: str, expires: int, token: str) -> bool:
        if expires < int(time.time()):
            return False
        expected = self._sign(file_id, expires)
        return hmac.compare_digest(expected, token)

    def read_bytes(self, key: str) -> bytes:
        path = self.root / key
        if not path.is_file():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File missing from disk")
        return path.read_bytes()


class R2Storage:
    def __init__(self, settings: Settings) -> None:
        if not all(
            [
                settings.r2_access_key_id,
                settings.r2_secret_access_key,
                settings.r2_bucket_name,
                settings.r2_endpoint_url,
            ]
        ):
            raise RuntimeError(
                "STORAGE_BACKEND=r2 requires R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, "
                "R2_BUCKET_NAME, and R2_ENDPOINT_URL"
            )
        self.bucket = settings.r2_bucket_name
        self.client = boto3.client(
            "s3",
            endpoint_url=settings.r2_endpoint_url,
            aws_access_key_id=settings.r2_access_key_id,
            aws_secret_access_key=settings.r2_secret_access_key,
            region_name="auto",
            config=Config(signature_version="s3v4"),
        )

    def put_bytes(self, key: str, data: bytes, content_type: str) -> None:
        self.client.put_object(Bucket=self.bucket, Key=key, Body=data, ContentType=content_type)

    def signed_url(self, key: str, filename: str, expires_in: int, file_id: str | None = None) -> str:
        return self.client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": self.bucket,
                "Key": key,
                "ResponseContentDisposition": f'inline; filename="{filename}"',
                "ResponseContentType": "application/pdf",
            },
            ExpiresIn=expires_in,
        )

    def verify_local_token(self, file_id: str, expires: int, token: str) -> bool:
        return False


_local: LocalStorage | None = None
_r2: R2Storage | None = None


def get_storage() -> LocalStorage | R2Storage:
    global _local, _r2
    settings = get_settings()
    backend = settings.storage_backend.lower()
    if backend == "r2":
        if _r2 is None:
            _r2 = R2Storage(settings)
        return _r2
    if _local is None:
        _local = LocalStorage(
            Path(settings.local_storage_dir),
            settings.secret_key,
            settings.api_public_url,
        )
    return _local
