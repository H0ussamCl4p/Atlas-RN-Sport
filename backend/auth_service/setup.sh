#!/bin/bash
# Quick start script for Atlas Authentication Service

echo "Starting Atlas Authentication Service Setup..."

# Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "Python version: $python_version"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "Virtual environment created"
else
    echo "Virtual environment already exists"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Create .env from template if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    
    # Generate secret key
    secret_key=$(python3 -c "import secrets; print(secrets.token_hex(32))")
    
    # Replace placeholder in .env (macOS/Linux compatible)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/your-super-secret-key-change-this-in-production-use-openssl-rand-hex-32/$secret_key/" .env
    else
        sed -i "s/your-super-secret-key-change-this-in-production-use-openssl-rand-hex-32/$secret_key/" .env
    fi
    
    echo ".env file created with secure SECRET_KEY"
    echo "Please review .env and adjust settings as needed"
else
    echo ".env file already exists"
fi

echo ""
echo "Setup complete!"
echo ""
echo "To start the service:"
echo "  1. Activate virtual environment: source venv/bin/activate"
echo "  2. Run the service: python app/main.py"
echo ""
echo "Or use: uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload"
echo ""
echo "API documentation will be available at: http://localhost:8001/docs"
