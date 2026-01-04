#!/bin/bash
# Run the AI service in development mode

echo "Starting AI Service..."
echo

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "ERROR: .env file not found!"
    echo "Please copy .env.example to .env and configure it."
    exit 1
fi

# Run the service
echo "Running on http://localhost:8002"
echo "API Docs: http://localhost:8002/docs"
echo
uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload
