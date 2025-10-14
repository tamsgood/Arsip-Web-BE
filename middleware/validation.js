import { body } from 'express-validator';

// Validation rules for document creation and update
export const validateDocument = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Judul dokumen harus diisi')
    .isLength({ min: 1, max: 200 })
    .withMessage('Judul dokumen harus antara 1-200 karakter'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Deskripsi tidak boleh lebih dari 1000 karakter')
];

// Validation for search parameters
export const validateSearchParams = [
  body('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Query pencarian tidak boleh lebih dari 100 karakter'),
  
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Halaman harus berupa angka positif'),
  
  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit harus antara 1-100'),
  
  body('sortBy')
    .optional()
    .isIn(['title', 'uploadDate', 'lastModified', 'fileSize'])
    .withMessage('Sort by harus salah satu dari: title, uploadDate, lastModified, fileSize'),
  
  body('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order harus asc atau desc')
];
