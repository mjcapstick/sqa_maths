from collections.abc import Callable

from fastapi import Depends

# Prototype: write routes are open. Swap this for a real auth check later
# without changing the routers — e.g. decode a session cookie / Bearer token.
AdminDep = Callable[..., None]


def require_admin() -> None:
    return None


admin_dependency = Depends(require_admin)
