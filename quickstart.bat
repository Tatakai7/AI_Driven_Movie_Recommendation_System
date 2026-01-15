@echo off
REM Colors simulation (Windows doesn't support ANSI codes by default)
setlocal enabledelayedexpansion

echo.
echo ========================================
echo Movie Recommendation System - Quick Start
echo ========================================
echo.

REM Check if Node.js is installed
echo Checking prerequisites...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)
echo [OK] Node.js found: 
node --version

REM Check if Python is installed
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed
    echo Please install Python from https://www.python.org/
    exit /b 1
)
echo [OK] Python found:
python --version

REM Create env files if they don't exist
echo.
echo Setting up environment files...

if not exist backend\.env (
    copy backend\.env.example backend\.env
    echo [OK] Created backend\.env
) else (
    echo [OK] backend\.env already exists
)

if not exist ml-backend\.env (
    copy ml-backend\.env.example ml-backend\.env
    echo [OK] Created ml-backend\.env
) else (
    echo [OK] ml-backend\.env already exists
)

if not exist .env.local (
    (
        echo VITE_API_URL=http://localhost:5000/api
    ) > .env.local
    echo [OK] Created .env.local
) else (
    echo [OK] .env.local already exists
)

REM Install backend dependencies
echo.
echo Installing backend dependencies...
cd backend
call npm install
cd ..
echo [OK] Backend dependencies installed

REM Install ML backend dependencies
echo.
echo Installing ML backend dependencies...
cd ml-backend
python -m venv venv
call venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt
call venv\Scripts\deactivate.bat
cd ..
echo [OK] ML backend dependencies installed

REM Install frontend dependencies
echo.
echo Installing frontend dependencies...
call npm install
echo [OK] Frontend dependencies installed

REM Print instructions
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo.
echo 1. In PowerShell/CMD 1 (Backend):
echo    cd backend ^&^& npm run dev
echo.
echo 2. In PowerShell/CMD 2 (ML Backend):
echo    cd ml-backend ^&^& venv\Scripts\activate ^&^& python -m src.app
echo.
echo 3. In PowerShell/CMD 3 (Frontend):
echo    npm run dev
echo.
echo Access the application at:
echo   Frontend: http://localhost:5173
echo   Backend API: http://localhost:5000
echo   ML Server: http://localhost:5001
echo.
echo Documentation:
echo   Setup Guide: SETUP.md
echo   Migration Summary: MIGRATION_SUMMARY.md
echo.
echo Happy coding! (rocket)
echo.
pause
