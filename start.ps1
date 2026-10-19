# Atlas - Startup Script (Windows PowerShell)

Write-Host "Atlas - Football Analytics Platform" -ForegroundColor Cyan

if (-not (Test-Path "backend\auth_service") -or -not (Test-Path "frontend")) {
    Write-Host "Error: Required directories (backend/ or frontend/) not found." -ForegroundColor Red
    exit 1
}

$RootDir = (Get-Location).Path

# 1. Start Auth Service (:8001)
Write-Host "Starting Auth Service on http://localhost:8001..." -ForegroundColor Green
Set-Location "$RootDir\backend\auth_service"

if (-not (Test-Path "venv")) {
    python -m venv venv
}

& .\venv\Scripts\Activate.ps1
pip install -r requirements.txt | Out-Null

if (-not (Test-Path ".env") -and (Test-Path ".env.example")) {
    Copy-Item .env.example .env
}

python -c "from app.db.session import init_db; init_db()"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; .\venv\Scripts\Activate.ps1; python app\main.py"

# 2. Start AI Service (:8002)
Write-Host "Starting AI Service on http://localhost:8002..." -ForegroundColor Green
Set-Location "$RootDir\backend\ai_service"

if (-not (Test-Path ".env") -and (Test-Path ".env.example")) {
    Copy-Item .env.example .env
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; if (Test-Path 'venv\Scripts\Activate.ps1') { .\venv\Scripts\Activate.ps1 }; python app\main_simple.py"

# 3. Start Frontend (:5173)
Set-Location "$RootDir\frontend"
Write-Host "Starting Frontend on http://localhost:5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

Set-Location $RootDir

Write-Host "All services started:" -ForegroundColor Green
Write-Host "  Auth Service: http://localhost:8001"
Write-Host "  AI Service:   http://localhost:8002"
Write-Host "  Frontend:     http://localhost:5173"
