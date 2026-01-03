# Quick start script for Atlas Authentication Service (Windows)

Write-Host "🚀 Starting Atlas Authentication Service Setup..." -ForegroundColor Green

# Check Python version
$pythonVersion = python --version 2>&1
Write-Host "✓ Python version: $pythonVersion" -ForegroundColor Green

# Create virtual environment if it doesn't exist
if (-not (Test-Path "venv")) {
    Write-Host "📦 Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "✓ Virtual environment created" -ForegroundColor Green
} else {
    Write-Host "✓ Virtual environment already exists" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "🔄 Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "📥 Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Create .env from template if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "⚙️  Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    
    # Generate secret key
    $secretKey = python -c "import secrets; print(secrets.token_hex(32))"
    
    # Replace placeholder in .env
    $envContent = Get-Content .env -Raw
    $envContent = $envContent -replace "your-super-secret-key-change-this-in-production-use-openssl-rand-hex-32", $secretKey
    Set-Content .env $envContent
    
    Write-Host "✓ .env file created with secure SECRET_KEY" -ForegroundColor Green
    Write-Host "⚠️  Please review .env and adjust settings as needed" -ForegroundColor Yellow
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the service:" -ForegroundColor Cyan
Write-Host "  1. Activate virtual environment: .\venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host "  2. Run the service: python app/main.py" -ForegroundColor White
Write-Host ""
Write-Host "Or use: uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload" -ForegroundColor White
Write-Host ""
Write-Host "📚 API documentation will be available at: http://localhost:8001/docs" -ForegroundColor Cyan
