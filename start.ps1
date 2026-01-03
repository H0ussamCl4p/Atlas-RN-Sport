# Atlas - Quick Start Script (Windows PowerShell)
# This script starts both backend and frontend for the authentication demo

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Atlas - Football Analytics Platform" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if backend directory exists
if (-not (Test-Path "backend\auth_service")) {
    Write-Host "❌ Backend directory not found!" -ForegroundColor Red
    Write-Host "Please ensure you're in the Atlas root directory."
    exit 1
}

# Start backend
Write-Host "🚀 Starting FastAPI backend on http://localhost:8001..." -ForegroundColor Green
Set-Location backend\auth_service

# Create virtual environment if it doesn't exist
if (-not (Test-Path "venv")) {
    Write-Host "📦 Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
& .\venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt | Out-Null

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "⚙️  Creating .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env
}

# Initialize database
Write-Host "🗄️  Initializing database..." -ForegroundColor Yellow
python -c "from app.db.session import init_db; init_db()"

# Start backend in new window
Write-Host "✅ Backend starting..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; .\venv\Scripts\Activate.ps1; python app\main.py"

Set-Location ..\..

# Wait for backend to start
Write-Host "⏳ Waiting for backend to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Start frontend in new window
Write-Host ""
Write-Host "🎨 Starting React frontend on http://localhost:5173..." -ForegroundColor Green
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

# Success message
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "✅ Atlas is running!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:8001" -ForegroundColor White
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Demo Login:" -ForegroundColor Yellow
Write-Host "  Email:    demo@atlas.ai" -ForegroundColor White
Write-Host "  Password: Demo123!" -ForegroundColor White
Write-Host ""
Write-Host "Close the PowerShell windows to stop services." -ForegroundColor Cyan
Write-Host ""
