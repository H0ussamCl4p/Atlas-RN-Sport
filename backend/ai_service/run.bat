@echo off
REM Run the AI service in development mode

echo Starting AI Service...
echo.

REM Activate virtual environment if it exists
if exist venv\Scripts\activate.bat (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
)

REM Check if .env exists
if not exist .env (
    echo ERROR: .env file not found!
    echo Please copy .env.example to .env and configure it.
    pause
    exit /b 1
)

REM Run the service
echo Running on http://localhost:8002
echo API Docs: http://localhost:8002/docs
echo.
uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload
