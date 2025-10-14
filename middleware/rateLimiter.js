import rateLimit from 'express-rate-limit';

// General API rate limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Terlalu banyak request dari IP ini, coba lagi dalam 15 menit'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// File upload rate limiter (more restrictive)
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 uploads per hour
  message: {
    success: false,
    message: 'Terlalu banyak upload dari IP ini, coba lagi dalam 1 jam'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Download rate limiter
export const downloadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 downloads per minute
  message: {
    success: false,
    message: 'Terlalu banyak download dari IP ini, coba lagi dalam 1 menit'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
