@echo off
echo 🚀 Installing Arsip Web Backend...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version
echo ✅ npm version: 
npm --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully
echo.

REM Create uploads directory
echo 📁 Creating uploads directory...
if not exist uploads mkdir uploads
echo ✅ Uploads directory created
echo.

REM Create .env file if it doesn't exist
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
    echo.
    echo ⚠️  Please edit .env file to configure your settings:
    echo    - Update MONGODB_URI if using remote MongoDB
    echo    - Update JWT_SECRET with a secure secret key
    echo    - Update FRONTEND_URL if your frontend runs on different port
    echo.
) else (
    echo ✅ .env file already exists
    echo.
)

echo 🎉 Installation completed successfully!
echo.
echo 📝 Next steps:
echo 1. Start MongoDB ^(if not already running^): mongod
echo 2. Setup database: npm run setup-db
echo 3. Start development server: npm run dev
echo 4. Test API: npm run test-api
echo.
echo 📚 Documentation: README.md
echo 🔗 API Base URL: http://localhost:3001/api
echo.
pause
