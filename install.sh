#!/bin/bash

echo "🚀 Installing Arsip Web Backend..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    echo "   Please update Node.js."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p uploads
echo "✅ Uploads directory created"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file..."
    cat > .env << EOF
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/arsip_web

# Server Configuration
PORT=3001
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=pdf,doc,docx,xls,xlsx,ppt,pptx,txt,jpg,jpeg,png,gif

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Security
JWT_SECRET=your-secret-key-here
EOF
    echo "✅ .env file created"
    echo ""
    echo "⚠️  Please edit .env file to configure your settings:"
    echo "   - Update MONGODB_URI if using remote MongoDB"
    echo "   - Update JWT_SECRET with a secure secret key"
    echo "   - Update FRONTEND_URL if your frontend runs on different port"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Check if MongoDB is running (optional)
echo "🔍 Checking MongoDB connection..."
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running. Please start MongoDB before running the server."
        echo "   Start MongoDB with: mongod"
    fi
else
    echo "⚠️  MongoDB command not found. Please ensure MongoDB is installed and in PATH."
    echo "   Visit: https://www.mongodb.com/try/download/community"
fi

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Start MongoDB (if not already running): mongod"
echo "2. Setup database: npm run setup-db"
echo "3. Start development server: npm run dev"
echo "4. Test API: npm run test-api"
echo ""
echo "📚 Documentation: README.md"
echo "🔗 API Base URL: http://localhost:3001/api"
echo ""
