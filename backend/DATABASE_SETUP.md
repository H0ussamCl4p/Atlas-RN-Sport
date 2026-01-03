# Atlas Database Setup and Migration Guide

## Quick Start

### 1. Install Dependencies

```bash
cd backend/shared
pip install -r requirements.txt
```

### 2. Initialize Alembic (First Time Only)

```bash
# From backend/shared directory
alembic init alembic
```

This creates:
```
backend/shared/
├── alembic/
│   ├── versions/  # Migration files
│   ├── env.py     # Migration environment
│   └── script.py.mako
└── alembic.ini    # Alembic configuration
```

### 3. Configure Alembic

Edit `alembic.ini`:
```ini
# Change this line:
sqlalchemy.url = postgresql://user:password@localhost:5432/atlas_db

# Or use environment variable:
# sqlalchemy.url = driver://user:pass@localhost/dbname
```

Edit `alembic/env.py` to import your models:
```python
# Add at the top
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent.parent))

# Import Base and all models
from backend.shared.models import Base
from backend.shared.models.user import User, UserProfile, Role, Permission, UserRole, RolePermission
from backend.shared.models.core import Team, Player, Season, Match, PlayerMatchStats
from backend.shared.models.ai import Video, Analysis, Event, Heatmap, Formation

# Set target_metadata
target_metadata = Base.metadata
```

### 4. Create Initial Migration

```bash
# Generate migration from models
alembic revision --autogenerate -m "Initial schema"

# This creates: alembic/versions/xxxx_initial_schema.py
```

### 5. Apply Migration

```bash
# Apply to database
alembic upgrade head
```

---

## Migration Workflow

### Creating Migrations

```bash
# After changing models
alembic revision --autogenerate -m "Add user preferences"

# Review the generated migration file
# Edit if needed (Alembic isn't perfect)

# Apply migration
alembic upgrade head
```

### Rolling Back

```bash
# Rollback one migration
alembic downgrade -1

# Rollback to specific version
alembic downgrade <revision_id>

# Rollback all
alembic downgrade base
```

### Viewing History

```bash
# Show current version
alembic current

# Show migration history
alembic history

# Show pending migrations
alembic history --verbose
```

---

## Database-Specific Setup

### PostgreSQL Setup (Production)

```bash
# Create database
createdb atlas_db

# Create user
createuser atlas_user -P  # Enter password when prompted

# Grant privileges
psql -c "GRANT ALL PRIVILEGES ON DATABASE atlas_db TO atlas_user;"

# Configure connection in .env
DATABASE_URL=postgresql://atlas_user:password@localhost:5432/atlas_db
```

### SQLite Setup (Development)

```bash
# Just set the DATABASE_URL
DATABASE_URL=sqlite:///./atlas.db

# Database file will be created automatically
```

---

## Database Initialization Script

Create `backend/shared/init_db.py`:

```python
"""
Database initialization script.
Creates all tables and seeds initial data.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

from backend.shared.models import Base
from backend.shared.models.user import seed_rbac_data

# Load environment
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./atlas.db")

def init_database():
    """Initialize database with tables and seed data."""
    print(f"Connecting to: {DATABASE_URL}")
    
    # Create engine
    engine = create_engine(DATABASE_URL, echo=True)
    
    # Create all tables
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created")
    
    # Seed RBAC data
    print("Seeding RBAC data...")
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        seed_rbac_data(session)
        print("✓ RBAC data seeded")
    except Exception as e:
        print(f"Warning: Could not seed RBAC data: {e}")
    finally:
        session.close()
    
    print("✓ Database initialized successfully")

if __name__ == "__main__":
    init_database()
```

Run it:
```bash
python backend/shared/init_db.py
```

---

## Microservice-Specific Databases

Each microservice can have its own database:

### Auth Service
```bash
createdb atlas_auth_db
alembic init alembic
# Configure for user domain only
alembic upgrade head
```

### Core Service
```bash
createdb atlas_core_db
alembic init alembic
# Configure for core domain (teams, players, matches)
alembic upgrade head
```

### AI Service
```bash
createdb atlas_ai_db
alembic init alembic
# Configure for AI domain (analyses, events, etc.)
alembic upgrade head
```

---

## Backup and Restore

### PostgreSQL

```bash
# Backup
pg_dump atlas_db > backup_$(date +%Y%m%d).sql

# Restore
psql atlas_db < backup_20260103.sql

# Backup specific tables
pg_dump -t users -t user_profiles atlas_db > user_backup.sql
```

### SQLite

```bash
# Backup
cp atlas.db atlas_backup_$(date +%Y%m%d).db

# Restore
cp atlas_backup_20260103.db atlas.db
```

---

## Testing Migrations

```bash
# Create test database
createdb atlas_test_db

# Run migrations
DATABASE_URL=postgresql://user:pass@localhost/atlas_test_db alembic upgrade head

# Run tests
pytest

# Clean up
dropdb atlas_test_db
```

---

## Common Issues

### Issue: "Target database is not up to date"
```bash
# Solution: Stamp current version
alembic stamp head
```

### Issue: "Can't locate revision identified by 'xxxxx'"
```bash
# Solution: Check alembic_version table
psql atlas_db -c "SELECT * FROM alembic_version;"

# Manual fix if needed
psql atlas_db -c "DELETE FROM alembic_version;"
alembic stamp head
```

### Issue: UUID type not available
```bash
# Solution: Install PostgreSQL extensions
psql atlas_db -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
```

---

## Best Practices

1. **Always review auto-generated migrations** - Alembic isn't perfect
2. **Test migrations on a copy** before production
3. **Keep migrations small** - One logical change per migration
4. **Document complex migrations** - Add comments explaining WHY
5. **Backup before major migrations**
6. **Use transactions** - Migrations should be atomic
7. **Version your database schema** - Commit migrations to git

---

## Production Deployment Checklist

- [ ] Backup database
- [ ] Test migration on staging
- [ ] Schedule downtime if needed
- [ ] Run migration with monitoring
- [ ] Verify data integrity
- [ ] Update application servers
- [ ] Monitor for errors
- [ ] Have rollback plan ready

---

**Your database is production-ready. Scale with confidence! 🚀**
