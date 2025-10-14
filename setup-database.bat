@echo off
echo 🗄️  Setting up database for Arsip Web Backend...
echo.

REM Check if .env file exists
if not exist .env (
    echo ❌ .env file not found. Please run install.bat first.
    pause
    exit /b 1
)

echo ✅ Running database setup...
echo.

npm run setup-db

echo.
echo 🎉 Database setup completed!
echo.
pause
