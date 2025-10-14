import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  // Database
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/arsip_web'
  },

  // Server
  server: {
    port: parseInt(process.env.PORT) || 3001,
    nodeEnv: process.env.NODE_ENV || 'development'
  },

  // File Upload
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
    uploadPath: process.env.UPLOAD_PATH || './uploads',
    allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'pdf,doc,docx,xls,xlsx,ppt,pptx,txt,jpg,jpeg,png,gif').split(',')
  },

  // CORS
  cors: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
  },

  // Security
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-here'
  }
};

// Validation
const validateConfig = () => {
  const required = ['mongodb.uri'];
  const missing = [];

  required.forEach(key => {
    const value = key.split('.').reduce((obj, k) => obj?.[k], config);
    if (!value) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    console.error('❌ Missing required configuration:', missing.join(', '));
    process.exit(1);
  }
};

// Validate configuration on load
validateConfig();

export default config;
