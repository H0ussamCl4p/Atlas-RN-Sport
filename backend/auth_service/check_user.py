"""Check and create demo user"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.user import User
from app.core.security import get_password_hash

# Create database session
SQLALCHEMY_DATABASE_URL = "sqlite:///./auth_service.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def check_and_create_user():
    db = SessionLocal()
    try:
        # Check existing users
        users = db.query(User).all()
        print(f"\n{'='*60}")
        print(f"DATABASE CHECK - Found {len(users)} users")
        print(f"{'='*60}\n")
        
        for user in users:
            print(f"📧 Email: {user.email}")
            print(f"   Active: {user.is_active}")
            print(f"   Created: {user.created_at}")
            print(f"   Superuser: {user.is_superuser}")
            print()
        
        # Check if demo user exists
        demo_user = db.query(User).filter(User.email == "demo@atlas.ai").first()
        
        if not demo_user:
            print("❌ Demo user doesn't exist. Creating now...")
            
            # Create demo user
            demo_user = User(
                email="demo@atlas.ai",
                full_name="Demo User",
                first_name="Demo",
                last_name="User",
                hashed_password=get_password_hash("demo123"),
                is_active=True,
                is_superuser=False,
                profile_completed=True
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)
            
            print(f"✅ Demo user created successfully!")
            print(f"   Email: demo@atlas.ai")
            print(f"   Password: demo123")
        else:
            print(f"✅ Demo user exists!")
            print(f"   Email: demo@atlas.ai")
            print(f"   Try password: demo123")
            print()
            print(f"⚠️  If login fails, the password might be different.")
            print(f"   Resetting password to: demo123")
            
            # Reset password
            demo_user.hashed_password = get_password_hash("demo123")
            db.commit()
            print(f"✅ Password reset complete!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    check_and_create_user()
