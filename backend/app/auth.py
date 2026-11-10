import os
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, List
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from sqlalchemy.orm import Session
from .database import get_db, DBUser, DBSecurityLog

JWT_SECRET = os.getenv("JWT_SECRET", "agritwin_super_secret_jwt_key_2026_enterprise_secure")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

security_bearer = HTTPBearer(auto_error=False)

def hash_password(password: str, salt: Optional[str] = None) -> str:
    """Hash password using PBKDF2-HMAC-SHA256 with 100,000 iterations."""
    if not salt:
        salt = secrets.token_hex(16)
    pw_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        100000
    ).hex()
    return f"{salt}${pw_hash}"

def verify_password(plain_password: str, hashed_combined: str) -> bool:
    """Verify password against salt$hash format."""
    try:
        salt, expected_hash = hashed_combined.split("$")
        computed_hash = hashlib.pbkdf2_hmac(
            "sha256",
            plain_password.encode("utf-8"),
            salt.encode("utf-8"),
            100000
        ).hex()
        return secrets.compare_digest(computed_hash, expected_hash)
    except Exception:
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create signed JWT access token."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(hours=JWT_EXPIRATION_HOURS))
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate JWT access token."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None

# Schemas
class UserRegisterRequest(BaseModel):
    name: Optional[str] = None
    full_name: Optional[str] = None
    email: str
    password: str
    mobile: Optional[str] = None
    role: str = "Farmer" # Farmer, Agronomist, Farm Administrator, Platform Administrator

class ForgotPasswordRequest(BaseModel):
    email: str
    new_password: Optional[str] = None

class UserLoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    role: str
    mobile: Optional[str]
    created_at: datetime
    last_login: Optional[datetime]

def get_current_user_optional(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer),
    db: Session = Depends(get_db)
) -> Optional[DBUser]:
    """Retrieve user if token present, otherwise None."""
    if not auth:
        return None
    payload = decode_access_token(auth.credentials)
    if not payload or "sub" not in payload:
        return None
    user = db.query(DBUser).filter(DBUser.id == payload["sub"]).first()
    return user

def get_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer),
    db: Session = Depends(get_db)
) -> DBUser:
    """Enforce authentication requirement."""
    if not auth:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please provide a valid Bearer token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = decode_access_token(auth.credentials)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(DBUser).filter(DBUser.id == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found.")
    return user

def require_roles(allowed_roles: List[str]):
    """Enforce Role-Based Access Control (RBAC)."""
    def role_checker(current_user: DBUser = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role: {', '.join(allowed_roles)}. Your role: {current_user.role}."
            )
        return current_user
    return role_checker

def log_security_event(
    db: Session,
    event_type: str,
    severity: str = "INFO",
    user_id: Optional[str] = None,
    ip_address: str = "127.0.0.1",
    user_agent: str = "Web Client",
    details: str = ""
):
    """Record an audit trail security event."""
    log = DBSecurityLog(
        event_type=event_type,
        severity=severity,
        user_id=user_id,
        ip_address=ip_address,
        user_agent=user_agent,
        details=details,
        timestamp=datetime.now(timezone.utc)
    )
    db.add(log)
    try:
        db.commit()
    except Exception:
        db.rollback()
