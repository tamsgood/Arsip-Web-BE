# Arsip Web Backend API

Backend API untuk sistem pengarsipan dokumen menggunakan Node.js, Express, dan MongoDB.

## Fitur

- ✅ Upload dokumen dengan berbagai format file
- ✅ Manajemen dokumen (CRUD operations)
- ✅ Pencarian dokumen berdasarkan judul dan deskripsi
- ✅ Download dokumen
- ✅ Statistik dokumen
- ✅ Pagination dan sorting
- ✅ Rate limiting untuk keamanan
- ✅ File validation dan filtering
- ✅ CORS support untuk frontend
- ✅ Error handling yang komprehensif

## Teknologi yang Digunakan

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM untuk MongoDB
- **Multer** - File upload handling
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API rate limiting
- **Morgan** - HTTP request logger

## Instalasi

1. **Clone repository dan masuk ke folder backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   - Copy `.env.example` ke `.env`
   - Sesuaikan konfigurasi sesuai kebutuhan:
   ```env
   MONGODB_URI=mongodb://localhost:27017/arsip_web
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   ALLOWED_FILE_TYPES=pdf,doc,docx,xls,xlsx,ppt,pptx,txt,jpg,jpeg,png,gif
   ```

4. **Pastikan MongoDB sudah berjalan:**
   ```bash
   # Local MongoDB
   mongod
   
   # Atau gunakan MongoDB Atlas (cloud)
   # Update MONGODB_URI di .env file
   ```

5. **Jalankan server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Base URL
```
http://localhost:3001/api
```

### Dokumen

#### GET /api/documents
Mengambil semua dokumen dengan fitur pagination dan search.

**Query Parameters:**
- `search` (optional) - Kata kunci pencarian
- `page` (optional) - Halaman (default: 1)
- `limit` (optional) - Jumlah item per halaman (default: 10, max: 100)
- `sortBy` (optional) - Field untuk sorting (title, uploadDate, lastModified, fileSize)
- `sortOrder` (optional) - Urutan sorting (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "documents": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalDocuments": 50,
      "hasNextPage": true,
      "hasPrevPage": false
    },
    "statistics": {
      "totalDocuments": 50,
      "currentMonthUploads": 10,
      "searchResults": 50
    }
  }
}
```

#### GET /api/documents/:id
Mengambil dokumen berdasarkan ID.

#### POST /api/documents
Upload dokumen baru.

**Body (multipart/form-data):**
- `title` (required) - Judul dokumen
- `description` (optional) - Deskripsi dokumen
- `file` (required) - File dokumen

**Response:**
```json
{
  "success": true,
  "message": "Dokumen berhasil diupload",
  "data": {
    "id": "...",
    "title": "...",
    "description": "...",
    "fileName": "...",
    "fileUrl": "...",
    "uploadDate": "..."
  }
}
```

#### PUT /api/documents/:id
Update dokumen (judul dan deskripsi).

**Body (application/json):**
```json
{
  "title": "Judul baru",
  "description": "Deskripsi baru"
}
```

#### DELETE /api/documents/:id
Hapus dokumen (soft delete).

#### GET /api/documents/download/:filename
Download file dokumen.

#### GET /api/documents/stats
Mengambil statistik dokumen.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDocuments": 50,
    "currentMonthUploads": 10,
    "lastMonthUploads": 8,
    "fileTypeStats": [
      {
        "_id": "application/pdf",
        "count": 25,
        "totalSize": 52428800
      }
    ]
  }
}
```

### Health Check

#### GET /health
Status server.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## Struktur Database

### Document Schema
```javascript
{
  title: String (required, max 200 chars),
  description: String (optional, max 1000 chars),
  fileName: String (required),
  originalFileName: String (required),
  filePath: String (required),
  fileUrl: String (required),
  fileSize: Number (required),
  mimeType: String (required),
  uploadDate: Date (default: now),
  lastModified: Date (default: now),
  isActive: Boolean (default: true)
}
```

## File Upload

### Format File yang Diizinkan
- PDF: `.pdf`
- Microsoft Word: `.doc`, `.docx`
- Microsoft Excel: `.xls`, `.xlsx`
- Microsoft PowerPoint: `.ppt`, `.pptx`
- Text: `.txt`
- Images: `.jpg`, `.jpeg`, `.png`, `.gif`

### Ukuran File
- Maksimal: 10MB (dapat dikonfigurasi di `.env`)

### Storage
- File disimpan di folder `uploads/` (dapat dikonfigurasi)
- Nama file di-generate otomatis untuk menghindari konflik

## Rate Limiting

- **General API**: 100 requests per 15 menit per IP
- **File Upload**: 10 uploads per jam per IP
- **File Download**: 20 downloads per menit per IP

## CORS Configuration

Frontend yang diizinkan mengakses API:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server)
- `http://localhost:3001` (Backend server)

## Error Handling

API menggunakan error handling yang konsisten:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [...] // optional, untuk validation errors
}
```

## Development

### Scripts
```bash
npm run dev    # Development mode dengan nodemon
npm start      # Production mode
```

### Logging
- Development: Detailed logs dengan Morgan
- Production: Standard HTTP logs

### Environment Variables
Lihat file `.env.example` untuk daftar lengkap environment variables.

## Deployment

1. **Setup production environment variables**
2. **Install dependencies**: `npm install --production`
3. **Start server**: `npm start`
4. **Setup reverse proxy** (Nginx/Apache) untuk production
5. **Setup SSL certificate** untuk HTTPS
6. **Configure MongoDB** (Atlas atau self-hosted)

## Security Features

- ✅ Helmet.js untuk security headers
- ✅ CORS protection
- ✅ Rate limiting
- ✅ File type validation
- ✅ File size limits
- ✅ Input validation dan sanitization
- ✅ Error handling tanpa informasi sensitif

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Pastikan MongoDB sudah berjalan
   - Check MONGODB_URI di .env file

2. **File Upload Error**
   - Check folder uploads/ ada dan writable
   - Check MAX_FILE_SIZE setting
   - Check ALLOWED_FILE_TYPES setting

3. **CORS Error**
   - Update FRONTEND_URL di .env file
   - Check frontend URL sudah benar

4. **Port Already in Use**
   - Change PORT di .env file
   - Atau kill process yang menggunakan port tersebut

## Support

Untuk pertanyaan atau masalah, silakan buat issue di repository atau hubungi developer.
