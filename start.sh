#!/bin/bash

echo "Atlas - Football Analytics Platform"

if [ ! -d "backend/auth_service" ] || [ ! -d "frontend" ]; then
    echo "Error: Required directories (backend/ or frontend/) not found."
    exit 1
fi

ROOT_DIR=$(pwd)

# 1. Start Auth Service (:8001)
echo "Starting Auth Service on http://localhost:8001..."
cd "$ROOT_DIR/backend/auth_service"

if [ ! -d "venv" ]; then
    python -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1

if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    cp .env.example .env
fi

python -c "from app.db.session import init_db; init_db()"
python app/main.py &
AUTH_PID=$!

# 2. Start AI Service (:8002)
echo "Starting AI Service on http://localhost:8002..."
cd "$ROOT_DIR/backend/ai_service"
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    cp .env.example .env
fi
python app/main_simple.py &
AI_PID=$!

# 3. Start Frontend (:5173)
echo "Starting Frontend on http://localhost:5173..."
cd "$ROOT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

cd "$ROOT_DIR"

echo "All services running:"
echo "  Auth Service: http://localhost:8001"
echo "  AI Service:   http://localhost:8002"
echo "  Frontend:     http://localhost:5173"
echo "Press Ctrl+C to stop all services."

trap "kill $AUTH_PID $AI_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
