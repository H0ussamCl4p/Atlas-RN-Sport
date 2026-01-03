# Authentication & Authorization Security Model

## Overview

The Atlas auth service implements a defense-in-depth security model with multiple layers of protection against unauthorized access and privilege escalation.

## Authentication

### JWT Token-Based Authentication

- **Access Tokens**: Short-lived (30 minutes), used for API requests
- **Refresh Tokens**: Long-lived (7 days), used to obtain new access tokens
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Storage**: 
  - Access token: In-memory (not persisted)
  - Refresh token: localStorage (client-side)

### Password Security

- **Hashing**: bcrypt with automatic salt generation
- **Truncation**: Passwords truncated to 72 bytes before hashing (bcrypt limitation)
- **Validation**: Minimum 8 characters, maximum 100 characters
- **Storage**: Only hashed passwords stored; plaintext never persisted

## Authorization - Role-Based Access Control (RBAC)

### Available Roles

The system defines three roles with distinct permissions:

1. **coach** - Team coaching staff
2. **analyst** - Performance analysts  
3. **admin** - System administrators

### Role Assignment Security

#### Self-Assignable Roles (Onboarding)

Users can assign themselves **ONLY** these roles during onboarding:
- `coach`
- `analyst`

**Implementation**: 
```python
ASSIGNABLE_ROLES = {"coach", "analyst"}
```

#### Protected Roles

The **admin** role **CANNOT** be self-assigned via API. It must be assigned:
- Manually via database update
- Through admin-only scripts
- By existing admin users (future feature)

**Rationale**: Prevents privilege escalation attacks where malicious users attempt to gain admin access.

## Onboarding Endpoints - Security Implementation

### Defense-in-Depth Layers

Each endpoint implements **multiple layers** of security validation:

#### Layer 1: Schema Validation (Pydantic)
```python
class RoleUpdate(BaseModel):
    role: str = Field(..., pattern="^(coach|analyst)$")
    
    @field_validator('role')
    def validate_role(cls, v: str) -> str:
        allowed_roles = {"coach", "analyst"}
        if v.lower() not in allowed_roles:
            raise ValueError("Invalid role")
        return v.lower()
```

**Purpose**: Reject invalid input before it reaches business logic.

#### Layer 2: Business Logic (Route Handler)
```python
if role_data.role.lower() not in ASSIGNABLE_ROLES:
    raise HTTPException(status_code=403, detail="Role not assignable")
```

**Purpose**: Enforce business rules even if schema validation is bypassed.

#### Layer 3: Authorization (JWT Dependency)
```python
current_user: User = Depends(get_current_user)
```

**Purpose**: Ensure user is authenticated before processing request.

### POST /api/v1/users/role

**Endpoint**: Assign role during onboarding (Step 1)

**Security Rules**:
1. ✅ User must be authenticated (JWT required)
2. ✅ Only `coach` or `analyst` can be assigned
3. ✅ `admin` role is explicitly rejected with 403 Forbidden
4. ✅ Role can only be set once (prevents role switching after onboarding)
5. ✅ User can only assign role to themselves (enforced by JWT)

**Error Codes**:
- `401 Unauthorized` - No JWT token or invalid token
- `403 Forbidden` - Attempting to assign protected role (admin)
- `409 Conflict` - Role already assigned

**Example Request**:
```bash
curl -X POST http://localhost:8001/api/v1/users/role \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"role": "coach"}'
```

**Attack Scenarios Prevented**:
- ❌ `{"role": "admin"}` → 403 Forbidden
- ❌ `{"role": "ADMIN"}` → 403 Forbidden (case-insensitive check)
- ❌ `{"role": "superuser"}` → 403 Forbidden
- ❌ Calling twice → 409 Conflict

### POST /api/v1/users/profile

**Endpoint**: Complete profile during onboarding (Step 2)

**Security Rules**:
1. ✅ User must be authenticated (JWT required)
2. ✅ User can only update their own profile (enforced by JWT)
3. ✅ Input sanitization (whitespace stripped)
4. ✅ Level validation (amateur, semi-pro, pro only)

**Validation**:
- `first_name`: 1-100 characters, whitespace trimmed
- `last_name`: 1-100 characters, whitespace trimmed
- `organization`: 1-255 characters, whitespace trimmed
- `level`: Must be `amateur`, `semi-pro`, or `pro`

**Error Codes**:
- `401 Unauthorized` - No JWT token or invalid token
- `422 Unprocessable Entity` - Invalid input data

**Example Request**:
```bash
curl -X POST http://localhost:8001/api/v1/users/profile \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jean",
    "last_name": "Dupont",
    "organization": "FC Example",
    "level": "pro"
  }'
```

### GET /api/v1/auth/me

**Endpoint**: Get current user information

**Security Rules**:
1. ✅ User must be authenticated (JWT required)
2. ✅ Returns only user's own data (no horizontal privilege escalation)
3. ✅ Sensitive fields excluded (hashed_password never returned)

**Response Format**:
```json
{
  "id": 1,
  "email": "coach@atlas.com",
  "roles": ["coach"],
  "profile_completed": true,
  "first_name": "Jean",
  "last_name": "Dupont",
  "organization": "FC Example",
  "level": "pro",
  "is_active": true,
  "is_superuser": false,
  "created_at": "2026-01-03T10:00:00Z",
  "updated_at": "2026-01-03T10:05:00Z"
}
```

## Security Best Practices Implemented

### 1. **No Magic Strings**
```python
# ✅ Good: Defined constant
ASSIGNABLE_ROLES = {"coach", "analyst"}

# ❌ Bad: Magic string
if role == "coach":  
```

### 2. **Explicit Type Hints**
```python
def update_user_role(
    role_data: RoleUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> UserResponse:
```

### 3. **Clear Error Messages**
```python
raise HTTPException(
    status_code=403,
    detail=f"Role '{role}' cannot be self-assigned. Only {', '.join(ASSIGNABLE_ROLES)} are allowed."
)
```

### 4. **Dependency Injection**
```python
current_user: User = Depends(get_current_user)
db: Session = Depends(get_db)
```

### 5. **Service Layer Separation**
```python
# Routes handle HTTP concerns
# Services handle business logic
user_service = UserService(db)
```

### 6. **Input Sanitization**
```python
@field_validator('first_name', 'last_name', 'organization')
def strip_whitespace(cls, v: str) -> str:
    return v.strip()
```

## Testing Security

### Manual Testing

#### Test 1: Attempt Admin Role Assignment
```bash
curl -X POST http://localhost:8001/api/v1/users/role \
  -H "Authorization: Bearer <token>" \
  -d '{"role": "admin"}' \
  -H "Content-Type: application/json"

# Expected: 403 Forbidden
```

#### Test 2: Attempt Role Reassignment
```bash
# First assignment (should succeed)
curl -X POST http://localhost:8001/api/v1/users/role \
  -H "Authorization: Bearer <token>" \
  -d '{"role": "coach"}' \
  -H "Content-Type: application/json"

# Second assignment (should fail)
curl -X POST http://localhost:8001/api/v1/users/role \
  -H "Authorization: Bearer <token>" \
  -d '{"role": "analyst"}' \
  -H "Content-Type: application/json"

# Expected: 409 Conflict
```

#### Test 3: Invalid Level
```bash
curl -X POST http://localhost:8001/api/v1/users/profile \
  -H "Authorization: Bearer <token>" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "organization": "Test Org",
    "level": "invalid_level"
  }' \
  -H "Content-Type: application/json"

# Expected: 422 Unprocessable Entity
```

### Automated Testing (Future)

```python
def test_admin_role_rejected():
    """Test that admin role cannot be self-assigned."""
    response = client.post(
        "/api/v1/users/role",
        json={"role": "admin"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 403
    assert "admin" in response.json()["detail"].lower()

def test_role_reassignment_prevented():
    """Test that role cannot be changed after initial assignment."""
    # Assign first role
    response1 = client.post(
        "/api/v1/users/role",
        json={"role": "coach"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response1.status_code == 200
    
    # Attempt to change role
    response2 = client.post(
        "/api/v1/users/role",
        json={"role": "analyst"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response2.status_code == 409
```

## Production Considerations

### Environment Variables
```bash
# .env
SECRET_KEY=<strong-random-key>  # Use secrets.token_urlsafe(32)
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
DATABASE_URL=<production-db-url>
```

### Logging & Monitoring
- Log all authentication attempts (success and failure)
- Log role assignment attempts (especially rejected ones)
- Monitor for repeated 403 errors (possible attack)
- Alert on admin role assignment (should only happen manually)

### Rate Limiting
Consider implementing rate limiting on sensitive endpoints:
- `/api/v1/auth/login` - Prevent brute force
- `/api/v1/auth/register` - Prevent abuse
- `/api/v1/users/role` - Prevent repeated attempts

### HTTPS Only
- **CRITICAL**: Always use HTTPS in production
- JWT tokens transmitted in Authorization header are vulnerable over HTTP

## Conclusion

This authentication system implements **defense-in-depth** security with:
- ✅ Multiple validation layers
- ✅ Explicit role restrictions  
- ✅ Clear separation of concerns
- ✅ Production-grade error handling
- ✅ Zero-tolerance for privilege escalation

**The admin role is intentionally protected and cannot be self-assigned under any circumstances.**
