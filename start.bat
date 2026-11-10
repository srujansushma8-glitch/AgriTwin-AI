@echo off
title AgriTwin AI - Integrated Agricultural Digital Twin
echo =========================================================================
echo               AgriTwin AI - Agricultural Digital Twin Platform
echo           Climate-Resilient Crop Production & Biophysical Simulation
echo =========================================================================
echo.

:: Check for Python virtual environment
if not exist "backend\venv\Scripts\python.exe" (
    echo [ERROR] Backend virtual environment not found in backend\venv.
    echo Please create one and install requirements:
    echo   python -m venv backend\venv
    echo   backend\venv\Scripts\pip install -r backend\requirements.txt
    pause
    exit /b 1
)

:: Check for node_modules in next-app
if not exist "next-app\node_modules" (
    echo [INFO] Installing frontend dependencies in next-app...
    cd next-app && npm install && cd ..
)

echo [1/2] Starting FastAPI Backend Daemon on http://localhost:8000 ...
start "AgriTwin Backend (FastAPI)" cmd /k "cd /d %~dp0backend && venv\Scripts\python run.py"

echo [2/2] Starting Next.js 16 Frontend on http://localhost:3000 ...
start "AgriTwin Frontend (Next.js)" cmd /k "cd /d %~dp0next-app && npm run dev"

echo.
echo =========================================================================
echo AgriTwin AI services launching:
echo   - Frontend:      http://localhost:3000
echo   - Backend API:   http://localhost:8000
echo   - OpenAPI Docs:  http://localhost:8000/docs
echo =========================================================================
echo Both services are now running in background windows.
echo Press any key to exit this launcher window (services keep running).
pause > nul

