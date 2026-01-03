You are a senior backend architect and data engineer.

I already have a standalone authentication microservice built with FastAPI.
Now I want to design a database architecture that is ready to:

1. Manage users and user-related metadata
2. Store football analysis data that will be processed by AI
3. Handle large, structured and semi-structured data (JSON)
4. Scale with a microservice architecture

CONTEXT:
- Backend uses FastAPI + SQLAlchemy
- Microservice architecture (each service owns its database)
- PostgreSQL in production, SQLite for development
- Redis may be added later
- AI models will analyze football match data (events, tracking, formations)

GOALS:
- Strong relational integrity where needed
- Flexible JSON storage for AI inputs/outputs
- Clean separation of concerns
- Database schema that does NOT need redesign later

DATABASE REQUIREMENTS:
- Use PostgreSQL as the primary database
- Use JSONB fields for AI-related data
- Use UUIDs as primary keys
- Timestamps for all entities
- Soft-deletion ready (optional)
- Indexed JSON fields where relevant

DESIGN THE FOLLOWING:

1. USER DOMAIN (Auth-compatible)
   - users table (minimal auth data)
   - user_profiles table (non-auth data)
   - roles and permissions (RBAC-ready)

2. MATCH & ANALYSIS DOMAIN
   - matches table (metadata only)
   - teams table
   - players table

3. AI ANALYSIS DOMAIN
   - analyses table
     - reference match_id
     - analysis_type (e.g. event_detection, formation, heatmap)
     - status (pending, processing, completed, failed)
     - input_data (JSONB)
     - output_data (JSONB)
     - model_metadata (JSONB: model name, version, params)
   - events table (optional relational + JSON hybrid)
     - event_type
     - timestamp
     - raw_event_data (JSONB)

4. STORAGE STRATEGY
   - Clearly explain what should be relational vs JSONB
   - Explain why JSONB is used for AI pipelines
   - Show example JSON structures for AI input/output

5. IMPLEMENTATION
   - SQLAlchemy models for all tables
   - Proper relationships and foreign keys
   - Indexing strategy (including JSONB indexes)
   - Database-agnostic setup (SQLite vs PostgreSQL)

6. FUTURE-PROOFING
   - How this schema supports:
     - New AI models
     - Reprocessing analyses
     - Multiple analysis versions
     - Large-scale data ingestion

OUTPUT:
- Clear schema explanation
- SQLAlchemy models (production-ready)
- Comments explaining architectural decisions
- No shortcuts or hacky solutions

IMPORTANT:
- This is for a production-scale football analytics platform
- Optimize for clarity, extensibility, and AI compatibility
- Assume this will grow beyond the hackathon

Act like this database will still be used 2 years from now.
# Atlas Backend Architecture

## 🏗️ System Overview

Atlas backend is a **microservices-based architecture** designed for scalability, maintainability, and independent deployment of services.

```
Atlas Platform
├── frontend/          → React + Vite (port 5173)
└── backend/
    └── auth_service/  → FastAPI Authentication (port 8001)
    └── [future services...]
```

---

## 🔐 Authentication Service

### Purpose
Stateless authentication microservice providing JWT-based user authentication for all backend services.

### Key Design Principles

#### 1. **Stateless Authentication**
- No server-side session storage
- All auth state in JWT tokens
- Enables horizontal scaling without shared state

#### 2. **Separation of Concerns**
```
Routes (HTTP) → Services (Business Logic) → Models (Data Access)
```

#### 3. **Database Agnostic**
- SQLAlchemy ORM abstracts database
- SQLite for development
- PostgreSQL for production
- Easy migration with Alembic

#### 4. **Security First**
- Bcrypt password hashing (timing-attack resistant)
- JWT with HS256 algorithm
- Access tokens (30 min) + Refresh tokens (7 days)
- Token type verification prevents confusion attacks
- CORS configuration for frontend security

---

## 📊 Data Flow

### Registration Flow
```
1. Client → POST /api/v1/auth/register
2. AuthService validates email uniqueness
3. UserService creates user with hashed password
4. AuthService generates JWT tokens
5. Client receives tokens → stores locally
6. Client can immediately make authenticated requests
```

### Login Flow
```
1. Client → POST /api/v1/auth/login (OAuth2 password flow)
2. AuthService authenticates credentials
3. UserService verifies user is active
4. AuthService generates JWT tokens
5. Client receives tokens → stores locally
```

### Protected Request Flow
```
1. Client → GET /api/v1/auth/me + Authorization: Bearer <token>
2. FastAPI extracts token via oauth2_scheme
3. get_current_user dependency validates token
4. Extracts user_id from token (sub claim)
5. Retrieves user from database
6. Returns user object to route handler
7. Route handler returns user data
```

### Token Refresh Flow
```
1. Access token expires (30 min)
2. Client → POST /api/v1/auth/refresh + refresh_token
3. AuthService validates refresh token
4. Generates new access token
5. Client receives new access token (keeps same refresh token)
```

---

## 🗄️ Database Schema

### User Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_superuser BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_user_email_active ON users(email, is_active);
```

---

## 🔑 JWT Token Structure

### Access Token Payload
```json
{
  "sub": "123",           // user_id
  "email": "user@example.com",
  "type": "access",
  "iat": 1672531200,      // issued at
  "exp": 1672533000       // expires in 30 min
}
```

### Refresh Token Payload
```json
{
  "sub": "123",           // user_id
  "type": "refresh",
  "iat": 1672531200,      // issued at
  "exp": 1673136000       // expires in 7 days
}
```

---

## 🌐 API Contract

### Standard Response Formats

**Success Response:**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

**Error Response:**
```json
{
  "detail": "User with this email already exists"
}
```

**User Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "is_superuser": false,
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

---

## 🔄 Service Integration Patterns

### How Other Services Use Auth

#### Pattern 1: Token Verification (Recommended)
Other services verify tokens independently using shared SECRET_KEY:

```python
# In another microservice
from jose import jwt

SECRET_KEY = "same-key-as-auth-service"

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except:
        raise Unauthorized()

def get_user_id_from_token(token: str) -> int:
    payload = verify_token(token)
    return int(payload["sub"])
```

#### Pattern 2: Gateway Pattern (Future)
API Gateway validates all tokens, forwards user_id in headers:

```
Client → Gateway (validates token) → Service (trusts header)
```

---

## 📈 Scaling Strategy

### Horizontal Scaling
```
Load Balancer
├── Auth Service Instance 1 (port 8001)
├── Auth Service Instance 2 (port 8002)
└── Auth Service Instance 3 (port 8003)
         ↓
   Shared PostgreSQL
```

**Why this works:**
- Stateless design (no session storage)
- Shared database for user data
- JWT tokens work across all instances
- No sticky sessions needed

### Database Scaling
```
PostgreSQL Primary (writes)
├── Read Replica 1 (reads)
└── Read Replica 2 (reads)
```

---

## 🛡️ Security Considerations

### Production Checklist

- [ ] Change SECRET_KEY (use `openssl rand -hex 32`)
- [ ] Set DEBUG=false
- [ ] Configure CORS_ORIGINS to actual frontend domains
- [ ] Use HTTPS/TLS in production
- [ ] Use PostgreSQL with SSL
- [ ] Set up database backups
- [ ] Implement rate limiting (e.g., slowapi)
- [ ] Add monitoring and logging
- [ ] Use environment variables for all secrets
- [ ] Rotate JWT secret keys periodically
- [ ] Implement token revocation if needed (blacklist)

### Attack Mitigation

| Attack | Mitigation |
|--------|------------|
| Brute force | Rate limiting on login endpoint |
| SQL injection | Parameterized queries via SQLAlchemy |
| XSS | Pydantic validation, no raw HTML |
| CSRF | Stateless JWT, no cookies (unless needed) |
| Timing attacks | Bcrypt (constant-time comparison) |
| Token confusion | Type field in JWT payload |

---

## 🧪 Testing Strategy

### Unit Tests
Test individual components in isolation:
- Services (UserService, AuthService)
- Security functions (hash_password, verify_token)
- Schemas validation

### Integration Tests
Test API endpoints:
```python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_register_user(client: AsyncClient):
    response = await client.post("/api/v1/auth/register", json={
        "email": "test@example.com",
        "password": "testpass123"
    })
    assert response.status_code == 201
    assert "access_token" in response.json()
```

---

## 📦 Future Microservices

### Planned Services

1. **Analysis Service** (port 8002)
   - Video processing
   - Player detection
   - Formation recognition
   
2. **Video Service** (port 8003)
   - Video storage
   - Streaming
   - Thumbnail generation

3. **Stats Service** (port 8004)
   - Statistical analysis
   - Heatmap generation
   - Reports

### Service Communication

**Option 1: Direct HTTP**
```
Frontend → Auth Service → get token
Frontend → Analysis Service (+ token) → verify token → process
```

**Option 2: Service Mesh (Advanced)**
```
Service A ↔ Service B via service mesh (e.g., Istio)
```

---

## 🔧 Development Workflow

### Local Development
```bash
# Terminal 1: Auth Service
cd backend/auth_service
python app/main.py

# Terminal 2: Frontend
cd frontend
npm run dev

# Frontend calls: http://localhost:8001/api/v1/...
```

### Production Deployment
```bash
# Using Docker Compose
docker-compose up -d

# Or Kubernetes
kubectl apply -f k8s/
```

---

## 📚 Code Organization Best Practices

### File Naming
- **Singular for models**: `user.py` not `users.py`
- **Plural for routes**: `users.py` (collection endpoint)
- **Descriptive services**: `auth_service.py`

### Import Order
1. Standard library
2. Third-party packages
3. Local application imports

### Type Hints
Always use type hints for better IDE support and documentation:
```python
def create_user(email: str, password: str) -> User:
    ...
```

---

## 🎯 Design Patterns Used

1. **Repository Pattern**: Service layer abstracts data access
2. **Dependency Injection**: FastAPI's Depends() for loose coupling
3. **Factory Pattern**: SessionLocal() creates DB sessions
4. **Singleton Pattern**: Settings instance
5. **Strategy Pattern**: Different auth strategies can be added
6. **DTO Pattern**: Pydantic schemas separate API from domain models

---

## 📖 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/en/14/orm/)
- [Pydantic Documentation](https://pydantic-docs.helpmanual.io/)

---

**Built with production standards in mind. Ready for hackathon and beyond! 🚀**
