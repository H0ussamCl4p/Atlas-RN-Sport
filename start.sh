#!/bin/bash

# Atlas - Quick Start Script
# This script starts both backend and frontend for the authentication demo

echo "======================================"
echo "Atlas - Football Analytics Platform"
echo "======================================"
echo ""

# Check if backend directory exists
if [ ! -d "backend/auth_service" ]; then
    echo "❌ Backend directory not found!"
    echo "Please ensure you're in the Atlas root directory."
    exit 1
fi

# Start backend in background
echo "🚀 Starting FastAPI backend on http://localhost:8001..."
cd backend/auth_service

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📦 Installing backend dependencies..."
pip install -r requirements.txt > /dev/null 2>&1

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
fi

# Initialize database
echo "🗄️  Initializing database..."
python -c "from app.db.session import init_db; init_db()"

# Start backend
echo "✅ Backend starting..."
python app/main.py &
BACKEND_PID=$!

cd ../..

# Wait for backend to start
echo "⏳ Waiting for backend to be ready..."
sleep 3

# Start frontend
echo ""
echo "🎨 Starting React frontend on http://localhost:5173..."
echo ""

npm run dev &
FRONTEND_PID=$!

# Wait for user to quit
echo ""
echo "======================================"
echo "✅ Atlas is running!"
echo "======================================"
echo ""
echo "Backend:  http://localhost:8001"
echo "Frontend: http://localhost:5173"
echo ""
echo "Demo Login:"
echo "  Email:    demo@atlas.ai"
echo "  Password: Demo123!"
echo ""
echo "Press Ctrl+C to stop all services..."
echo ""

# Trap Ctrl+C to kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT

# Wait
wait
