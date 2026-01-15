#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Movie Recommendation System - Quick Start${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if Node.js is installed
echo -e "${YELLOW}Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    echo "Please install Python 3 from https://www.python.org/"
    exit 1
fi
echo -e "${GREEN}✅ Python found: $(python3 --version)${NC}"

# Check if MongoDB is available
echo ""
echo -e "${YELLOW}Checking MongoDB...${NC}"
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✅ MongoDB is installed${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB not found locally${NC}"
    echo "You can:"
    echo "  1. Install MongoDB: https://www.mongodb.com/try/download/community"
    echo "  2. Use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Create env files if they don't exist
echo ""
echo -e "${YELLOW}Setting up environment files...${NC}"

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✅ Created backend/.env${NC}"
else
    echo -e "${GREEN}✅ backend/.env already exists${NC}"
fi

if [ ! -f ml-backend/.env ]; then
    cp ml-backend/.env.example ml-backend/.env
    echo -e "${GREEN}✅ Created ml-backend/.env${NC}"
else
    echo -e "${GREEN}✅ ml-backend/.env already exists${NC}"
fi

if [ ! -f .env.local ]; then
    cp .env.example .env.local 2>/dev/null || echo "VITE_API_URL=http://localhost:5000/api" > .env.local
    echo -e "${GREEN}✅ Created .env.local${NC}"
else
    echo -e "${GREEN}✅ .env.local already exists${NC}"
fi

# Install dependencies
echo ""
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd backend
npm install
cd ..
echo -e "${GREEN}✅ Backend dependencies installed${NC}"

echo ""
echo -e "${YELLOW}Installing ML backend dependencies...${NC}"
cd ml-backend
python3 -m venv venv

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows
    source venv/Scripts/activate
else
    # macOS/Linux
    source venv/bin/activate
fi

pip install --upgrade pip
pip install -r requirements.txt
deactivate
cd ..
echo -e "${GREEN}✅ ML backend dependencies installed${NC}"

echo ""
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

# Print instructions
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}To start the application:${NC}"
echo ""
echo "1. ${GREEN}In Terminal 1 (Backend):${NC}"
echo "   cd backend && npm run dev"
echo ""
echo "2. ${GREEN}In Terminal 2 (ML Backend):${NC}"
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    echo "   cd ml-backend && venv\\Scripts\\activate && python -m src.app"
else
    echo "   cd ml-backend && source venv/bin/activate && python -m src.app"
fi
echo ""
echo "3. ${GREEN}In Terminal 3 (Frontend):${NC}"
echo "   npm run dev"
echo ""
echo -e "${YELLOW}Access the application at:${NC}"
echo "  Frontend: http://localhost:5173"
echo "  Backend API: http://localhost:5000"
echo "  ML Server: http://localhost:5001"
echo ""
echo -e "${YELLOW}Documentation:${NC}"
echo "  Setup Guide: SETUP.md"
echo "  Migration Summary: MIGRATION_SUMMARY.md"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
