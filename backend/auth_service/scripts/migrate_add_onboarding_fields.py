"""
Database migration script to add onboarding fields to users table.
Run this once to update the existing database schema.
"""
import sqlite3
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings

def migrate():
    """Add onboarding fields to users table."""
    db_path = "auth_service.db"
    
    print(f"Migrating database: {db_path}")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Add new columns
        migrations = [
            "ALTER TABLE users ADD COLUMN first_name VARCHAR(100)",
            "ALTER TABLE users ADD COLUMN last_name VARCHAR(100)",
            "ALTER TABLE users ADD COLUMN organization VARCHAR(255)",
            "ALTER TABLE users ADD COLUMN level VARCHAR(50)",
            "ALTER TABLE users ADD COLUMN roles TEXT",
            "ALTER TABLE users ADD COLUMN profile_completed BOOLEAN DEFAULT 0",
        ]
        
        for migration_sql in migrations:
            try:
                cursor.execute(migration_sql)
                print(f"{migration_sql}")
            except sqlite3.OperationalError as e:
                if "duplicate column name" in str(e).lower():
                    print(f"⊗ Column already exists: {migration_sql}")
                else:
                    print(f"Error: {e}")
                    raise
        
        conn.commit()
        print("\nMigration completed successfully!")
        
    except Exception as e:
        conn.rollback()
        print(f"\nMigration failed: {e}")
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
