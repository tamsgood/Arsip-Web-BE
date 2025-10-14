@echo off
echo 🚀 Starting Arsip Web Backend in Development Mode...
echo.

REM Check if .env file exists
if not exist .env (
    echo ❌ .env file not found. Please run install.bat first.
    pause
    exit /b 1
)

REM Check if uploads directory exists
if not exist uploads (
    echo 📁 Creating uploads directory...
    mkdir uploads
)

REM Start the development server
echo ✅ Starting server...
echo 🔗 API will be available at: http://localhost:3001/api
echo 📊 Health check: http://localhost:3001/health
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
