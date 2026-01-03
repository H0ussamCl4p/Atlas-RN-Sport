"""Simple database viewer"""
import sqlite3
import os

db_path = "auth_service.db"

if not os.path.exists(db_path):
    print(f"❌ Database not found: {db_path}")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Check if users table exists
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users';")
if not cursor.fetchone():
    print("❌ Users table doesn't exist!")
    exit(1)

# Get all users
cursor.execute("SELECT email, is_active, created_at, is_superuser FROM users;")
users = cursor.fetchall()

print(f"\n{'='*60}")
print(f"DATABASE CHECK - Found {len(users)} users")
print(f"{'='*60}\n")

if users:
    for email, is_active, created_at, is_superuser in users:
        print(f"📧 Email: {email}")
        print(f"   Active: {is_active}")
        print(f"   Superuser: {is_superuser}")
        print(f"   Created: {created_at}")
        print()
else:
    print("❌ No users found in database!")
    print("\nTo create a user, run the auth service's create_demo_user.py script:")
    print("  python scripts/create_demo_user.py")

conn.close()
