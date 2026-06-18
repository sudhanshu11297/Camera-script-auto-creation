#!/bin/bash

# RAG System Quick Start Setup Script

echo "🚀 RAG System Setup"
echo "===================="

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✓ Python 3 found"

# Navigate to backend
cd backend || exit

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Copy .env template
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  Created .env file. Please add your OpenAI API key!"
    echo "   Edit: backend/.env"
    echo "   Add: OPENAI_API_KEY=sk-..."
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env and add your OpenAI API key"
echo "2. Run: python main.py"
echo "3. The API will be available at http://localhost:8000"
echo ""
echo "To upload documents and start using the RAG system:"
echo "- Copy RAGSearch.jsx and RAGSearch.css to your React project"
echo "- Import RAGSearch component in your app"
