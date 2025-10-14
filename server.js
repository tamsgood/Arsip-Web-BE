import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Import middleware
import corsMiddleware from './middleware/cors.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { generalLimiter, uploadLimiter, downloadLimiter } from './middleware/rateLimiter.js';

// Import database connection
import connectDB from './config/database.js';

// Import routes
import documentRoutes from './routes/documentRoutes.js';

// Load environment variables
dotenv.config();

// ES6 module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Compression middleware
app.use(compression());

// CORS middleware
app.use(corsMiddleware);

// Rate limiting
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/documents', documentRoutes);

// API root endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Arsip Web API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      documents: '/api/documents',
      stats: '/api/documents/stats',
      download: '/api/documents/download/:filename'
    }
  });
});

// Apply specific rate limiters to upload and download routes
app.use('/api/documents', uploadLimiter);
app.use('/api/documents/download', downloadLimiter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Arsip Web API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      documents: '/api/documents',
      stats: '/api/documents/stats',
      download: '/api/documents/download/:filename'
    },
    documentation: 'Lihat README.md untuk dokumentasi lengkap'
  });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;
