# Atlas Authentication Service

**Production-ready authentication microservice for the Atlas football tactical analysis platform.**

## 🏗️ Architecture

- **Framework**: FastAPI (Python 3.11+)
- **Authentication**: JWT (access + refresh tokens)
- **Database**: SQLAlchemy ORM (SQLite dev, PostgreSQL prod)
- **Security**: OAuth2 password flow, bcrypt password hashing
- **Design**: Stateless, horizontally scalable, clean architecture

## 📁 Project Structure

```
auth_service/
├── app/
│   ├── api/
│   │   └── v1/              # API version 1 endpoints
│   │       ├── auth.py      # Authentication routes
│   │       ├── health.py    # Health check endpoints
│   │       └── __init__.py
│   ├── core/                # Core utilities
│   │   ├── config.py        # Environment configuration
│   │   ├── security.py      # JWT & password hashing
│   │   └── dependencies.py  # FastAPI dependencies
│   ├── db/                  # Database layer
│   │   ├── base.py          # Base model & mixins
│   │   └── session.py       # DB connection & session
│   ├── models/              # SQLAlchemy models
│   │   └── user.py          # User model
│   ├── schemas/             # Pydantic schemas
│   │   └── user.py          # Request/response schemas
│   ├── services/            # Business logic
│   │   ├── auth_service.py  # Auth operations
│   │   └── user_service.py  # User operations
│   └── main.py              # Application entry point
├── .env.example             # Environment template
├── .gitignore
├── requirements.txt
└── README.md
```

## 🚀 Quick Start

### 1. Prerequisites

- Python 3.11+
- pip

### 2. Installation

```bash
# Navigate to auth service directory
cd backend/auth_service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env and set your SECRET_KEY
# Generate a secure key with:
# python -c "import secrets; print(secrets.token_hex(32))"
```

### 4. Run the Service

```bash
# Development mode (auto-reload)
python app/main.py

# Or with uvicorn directly:
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

The service will be available at:
- **API**: http://localhost:8001
- **Docs**: http://localhost:8001/docs (interactive Swagger UI)
- **ReDoc**: http://localhost:8001/redoc (alternative docs)

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login with email/password | No |
| POST | `/api/v1/auth/refresh` | Refresh access token | No |
| GET | `/api/v1/auth/me` | Get current user info | Yes |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health/` | Basic health check |
| GET | `/api/v1/health/db` | Health check with DB test |

## 🔑 Usage Examples

### Register a New User

```bash
curl -X POST "http://localhost:8001/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "coach@atlas.com",
    "password": "securepassword123",
    "full_name": "John Doe"
  }'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Login

```bash
curl -X POST "http://localhost:8001/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=coach@atlas.com&password=securepassword123"
```

### Access Protected Endpoint

```bash
curl -X GET "http://localhost:8001/api/v1/auth/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Refresh Token

```bash
curl -X POST "http://localhost:8001/api/v1/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "YOUR_REFRESH_TOKEN"
  }'
```

## 🔒 Security Features

- ✅ **Bcrypt password hashing** - Industry-standard, resistant to timing attacks
- ✅ **JWT stateless authentication** - No server-side session storage needed
- ✅ **Access + refresh token pattern** - Short-lived access tokens, long-lived refresh tokens
- ✅ **Token type verification** - Prevents token confusion attacks
- ✅ **CORS configuration** - Secure cross-origin requests
- ✅ **Environment-based secrets** - No hardcoded credentials
- ✅ **OAuth2 compliance** - Standard authentication flow

## 🗄️ Database

### Development
Uses SQLite for local development (no setup required).

### Production
Configure PostgreSQL in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/atlas_auth"
DB_POOL_SIZE=10
DB_MAX_OVERFLOW=20
```

### Migrations
For production, use Alembic for database migrations:

```bash
# Initialize Alembic
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Initial migration"

# Apply migration
alembic upgrade head
```

## 🧪 Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html
```

## 🚢 Production Deployment

### Environment Variables

Ensure these are set in production:

```env
ENVIRONMENT="production"
DEBUG=false
SECRET_KEY="<generate-with-openssl-rand-hex-32>"
DATABASE_URL="postgresql://..."
CORS_ORIGINS='["https://app.atlas.com"]'
```

### Running with Docker (Recommended)

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app/

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
```

```bash
docker build -t atlas-auth-service .
docker run -p 8001:8001 --env-file .env atlas-auth-service
```

### Running with Systemd

Create `/etc/systemd/system/atlas-auth.service`:

```ini
[Unit]
Description=Atlas Authentication Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/atlas/backend/auth_service
Environment="PATH=/opt/atlas/backend/auth_service/venv/bin"
ExecStart=/opt/atlas/backend/auth_service/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8001
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
systemctl enable atlas-auth
systemctl start atlas-auth
```

## 🔄 Integration with Frontend

### React Example

```typescript
// Login
const response = await fetch('http://localhost:8001/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    username: email,
    password: password
  })
});

const { access_token, refresh_token } = await response.json();

// Store tokens
localStorage.setItem('access_token', access_token);
localStorage.setItem('refresh_token', refresh_token);

// Use token in requests
const userResponse = await fetch('http://localhost:8001/api/v1/auth/me', {
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});
```

## 🤝 Integration with Other Microservices

This auth service is designed to be reused by other microservices:

1. **Shared JWT verification**: Other services can verify tokens using the same `SECRET_KEY`
2. **User ID in token**: Extract `sub` claim to get user_id for database queries
3. **Stateless design**: No shared session state required

Example in another Python service:

```python
from jose import jwt

def verify_token(token: str) -> dict:
    payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    return payload

def get_user_id(token: str) -> int:
    payload = verify_token(token)
    return int(payload["sub"])
```

## 📝 Design Decisions

1. **Clean Architecture**: Separation of concerns (routes → services → models)
2. **Dependency Injection**: FastAPI's DI system for testability
3. **Stateless JWT**: Enables horizontal scaling without session storage
4. **Service Layer Pattern**: Business logic isolated from HTTP layer
5. **Pydantic Validation**: Type-safe request/response handling
6. **Database Agnostic**: SQLAlchemy supports multiple databases
7. **API Versioning**: Future-proof with `/api/v1` prefix

## 🐛 Troubleshooting

### Database connection errors
- Check `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running (if using PostgreSQL)
- Verify credentials and permissions

### Token validation errors
- Ensure `SECRET_KEY` is consistent across deployments
- Check token expiration times
- Verify Authorization header format: `Bearer <token>`

### CORS errors
- Add frontend URL to `CORS_ORIGINS` in `.env`
- Verify frontend is sending credentials if needed

## 📄 License

Part of the Atlas platform. See main repository for license information.

## 👥 Support

For issues or questions:
- Open an issue in the main repository
- Contact the backend team
- Check API docs at `/docs`

---

**Built with ❤️ for the Atlas hackathon project**
