#!/bin/bash

# MERN Testing Application Setup Script
echo "🚀 Setting up MERN Testing Application..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first:"
    echo "npm install -g pnpm"
    exit 1
fi

# Check if Node.js version is 18 or higher
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ pnpm version: $(pnpm --version)"

# Install dependencies
echo "📦 Installing dependencies..."

# Root dependencies
echo "Installing root dependencies..."
pnpm install

# Client dependencies
echo "Installing client dependencies..."
cd client && pnpm install && cd ..

# Server dependencies
echo "Installing server dependencies..."
cd server && pnpm install && cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created. Please edit it with your configuration."
else
    echo "✅ .env file already exists."
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p client/src/tests/__mocks__
mkdir -p server/tests/unit/models

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Start MongoDB (local or Atlas)"
echo "3. Run the application: pnpm dev"
echo "4. Run tests: pnpm test"
echo ""
echo "For detailed instructions, see SETUP.md" 