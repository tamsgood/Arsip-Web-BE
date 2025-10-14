@echo off
echo 🧪 Testing Arsip Web API...
echo.

REM Check if server is running
echo 🔍 Checking if server is running...
curl -s http://localhost:3001/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Server is not running. Please start the server first with:
    echo    npm run dev
    echo    or
    echo    start-dev.bat
    echo.
    pause
    exit /b 1
)

echo ✅ Server is running
echo.

echo 🧪 Running API tests...
npm run test-api

echo.
echo 🎉 API tests completed!
echo.
pause
