# Windows Setup Guide - Arsip Web Backend

Panduan instalasi dan setup backend untuk sistem pengarsipan dokumen di Windows.

## Persyaratan Sistem

- **Windows 10/11**
- **Node.js 18+** - [Download di sini](https://nodejs.org/)
- **MongoDB** - [Download di sini](https://www.mongodb.com/try/download/community)

## Instalasi Cepat

### 1. Install Dependencies
```batch
# Jalankan file instalasi
install.bat
```

### 2. Setup Database
```batch
# Setup database dan buat sample data
setup-database.bat
```

### 3. Start Development Server
```batch
# Jalankan server dalam mode development
start-dev.bat
```

### 4. Test API
```batch
# Test semua endpoint API
test-api.bat
```

## Instalasi Manual

### 1. Install Node.js dan MongoDB
- Download dan install Node.js dari [nodejs.org](https://nodejs.org/)
- Download dan install MongoDB dari [mongodb.com](https://www.mongodb.com/try/download/community)

### 2. Install Dependencies
```batch
cd backend
npm install
```

### 3. Setup Environment
Buat file `.env` dengan konfigurasi berikut:
```env
MONGODB_URI=mongodb://localhost:27017/arsip_web
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=pdf,doc,docx,xls,xlsx,ppt,pptx,txt,jpg,jpeg,png,gif
JWT_SECRET=your-secret-key-here
```

### 4. Setup Database
```batch
npm run setup-db
```

### 5. Start Server
```batch
# Development mode
npm run dev

# Production mode
npm start
```

## Struktur Folder

```
backend/
├── config/          # Konfigurasi database dan upload
├── controllers/     # Logic controller
├── middleware/      # Middleware functions
├── models/          # MongoDB models
├── routes/          # API routes
├── scripts/         # Utility scripts
├── uploads/         # Folder untuk file upload
├── server.js        # Main server file
├── package.json     # Dependencies
├── README.md        # Dokumentasi lengkap
└── *.bat           # Windows batch files
```

## API Endpoints

### Base URL: `http://localhost:3001/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/documents` | Get all documents |
| GET | `/documents/stats` | Get statistics |
| POST | `/documents` | Upload document |
| GET | `/documents/:id` | Get single document |
| PUT | `/documents/:id` | Update document |
| DELETE | `/documents/:id` | Delete document |
| GET | `/documents/download/:filename` | Download file |

## Troubleshooting

### MongoDB Connection Error
```batch
# Pastikan MongoDB service berjalan
net start MongoDB

# Atau jalankan MongoDB secara manual
mongod
```

### Port Already in Use
```batch
# Ganti port di .env file
PORT=3002
```

### CORS Error
```batch
# Update FRONTEND_URL di .env file
FRONTEND_URL=http://localhost:5173
```

### File Upload Error
```batch
# Pastikan folder uploads ada dan writable
mkdir uploads
```

## Script Commands

| Script | Description |
|--------|-------------|
| `install.bat` | Install dependencies dan setup awal |
| `setup-database.bat` | Setup database dan sample data |
| `start-dev.bat` | Start development server |
| `test-api.bat` | Test semua API endpoints |

## Development Commands

```batch
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Setup database
npm run setup-db

# Test API
npm run test-api
```

## File Upload

### Format yang Didukung
- **PDF**: `.pdf`
- **Microsoft Office**: `.doc`, `.docx`, `.xls`, `.xlsx`, `.ppt`, `.pptx`
- **Text**: `.txt`
- **Images**: `.jpg`, `.jpeg`, `.png`, `.gif`

### Ukuran Maksimal
- **10MB** (dapat dikonfigurasi di `.env`)

## Security Features

- ✅ CORS protection
- ✅ Rate limiting
- ✅ File type validation
- ✅ File size limits
- ✅ Input validation
- ✅ Error handling

## Support

Untuk pertanyaan atau masalah:
1. Check file `README.md` untuk dokumentasi lengkap
2. Pastikan semua dependencies terinstall
3. Check log error di console
4. Pastikan MongoDB berjalan

## Next Steps

Setelah backend berjalan:
1. Frontend sudah siap di folder `frontend/`
2. Update URL API di frontend ke `http://localhost:3001/api`
3. Jalankan frontend dengan `npm run dev`
4. Test integrasi frontend-backend
