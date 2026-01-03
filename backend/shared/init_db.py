"""
Database initialization script.
Creates all tables and seeds initial data.

Usage:
    python backend/shared/init_db.py
"""
import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent.parent))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

from backend.shared.models import Base
from backend.shared.models.user import seed_rbac_data

# Load environment
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./atlas.db")


def init_database():
    """Initialize database with tables and seed data."""
    print("=" * 60)
    print("Atlas Database Initialization")
    print("=" * 60)
    print(f"\n📊 Database URL: {DATABASE_URL}")
    
    # Create engine
    engine = create_engine(DATABASE_URL, echo=True)
    
    # Create all tables
    print("\n🔨 Creating tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ All tables created successfully")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        return False
    
    # Seed RBAC data
    print("\n👥 Seeding RBAC data...")
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        seed_rbac_data(session)
        print("✅ RBAC data seeded successfully")
        print("\n📋 Created roles:")
        print("   - super_admin: Full system access")
        print("   - admin: Manage users and analyses")
        print("   - analyst: Create and view analyses")
        print("   - viewer: Read-only access")
    except Exception as e:
        print(f"⚠️  Warning: Could not seed RBAC data: {e}")
        session.rollback()
    finally:
        session.close()
    
    print("\n" + "=" * 60)
    print("✅ Database initialized successfully!")
    print("=" * 60)
    print("\n🚀 Next steps:")
    print("   1. Run your application")
    print("   2. Create your first user")
    print("   3. Start analyzing! 🏟️")
    
    return True


if __name__ == "__main__":
    success = init_database()
    sys.exit(0 if success else 1)
