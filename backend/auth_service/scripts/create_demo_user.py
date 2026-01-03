"""
Create demo user for Atlas authentication.

This script creates the demo user account for judges:
- Email: demo@atlas.ai
- Password: Demo123!
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base import Base
from app.models.user import User
from app.core.security import hash_password
from app.core.config import get_settings

settings = get_settings()


def create_demo_user():
    """Create demo user in database."""
    print("=" * 60)
    print("Creating Demo User")
    print("=" * 60)
    
    # Create engine
    engine = create_engine(settings.DATABASE_URL, echo=True)
    
    # Create tables if they don't exist
    print("\nCreating tables...")
    Base.metadata.create_all(bind=engine)
    
    # Create session
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # Check if demo user already exists
        existing_user = session.query(User).filter(User.email == "demo@atlas.ai").first()
        
        if existing_user:
            print("\n⚠️  Demo user already exists!")
            print(f"   Email: {existing_user.email}")
            print(f"   ID: {existing_user.id}")
            return
        
        # Create demo user
        demo_user = User(
            email="demo@atlas.ai",
            hashed_password=hash_password("Demo123!"),
            full_name="Demo User (RN Sport 2026)",
            is_active=True
        )
        
        session.add(demo_user)
        session.commit()
        session.refresh(demo_user)
        
        print("\n✅ Demo user created successfully!")
        print(f"   Email: {demo_user.email}")
        print(f"   Password: Demo123!")
        print(f"   ID: {demo_user.id}")
        print(f"   Full Name: {demo_user.full_name}")
        
    except Exception as e:
        print(f"\n❌ Error creating demo user: {e}")
        session.rollback()
    finally:
        session.close()
    
    print("\n" + "=" * 60)
    print("Demo user ready for login!")
    print("=" * 60)


if __name__ == "__main__":
    create_demo_user()
