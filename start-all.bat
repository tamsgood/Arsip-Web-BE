@echo off
echo 🚀 Starting Arsip Web Backend - Complete Setup
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist node_modules (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if .env file exists
if not exist .env (
    echo ⚙️  Creating .env file...
    (
        echo # Database Configuration
        echo MONGODB_URI=mongodb://localhost:27017/arsip_web
        echo.
        echo # Server Configuration
        echo PORT=3001
        echo NODE_ENV=development
        echo.
        echo # File Upload Configuration
        echo MAX_FILE_SIZE=10485760
        echo UPLOAD_PATH=./uploads
        echo ALLOWED_FILE_TYPES=pdf,doc,docx,xls,xlsx,ppt,pptx,txt,jpg,jpeg,png,gif
        echo.
        echo # CORS Configuration
        echo FRONTEND_URL=http://localhost:5173
        echo.
        echo # Security
        echo JWT_SECRET=your-secret-key-here
    ) > .env
    echo ✅ .env file created
)

REM Create uploads directory
if not exist uploads mkdir uploads

REM Check if MongoDB is running
echo 🔍 Checking MongoDB connection...
curl -s http://localhost:27017 >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB is not running. Please start MongoDB first:
    echo    net start MongoDB
    echo    or
    echo    mongod
    echo.
    echo Press any key to continue anyway...
    pause >nul
)

REM Setup database
echo 🗄️  Setting up database...
npm run setup-db
if %errorlevel% neq 0 (
    echo ⚠️  Database setup failed, but continuing...
)

echo.
echo 🎉 Setup completed! Starting server...
echo.
echo 📝 Server Information:
echo    - API Base URL: http://localhost:3001/api
echo    - Health Check: http://localhost:3001/health
echo    - Frontend URL: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the development server
npm run dev
