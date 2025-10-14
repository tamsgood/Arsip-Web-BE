import express from 'express';
import {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  downloadFile,
  getDocumentStats
} from '../controllers/documentController.js';
import { validateDocument, validateSearchParams } from '../middleware/validation.js';
import upload from '../config/upload.js';

const router = express.Router();

// GET /api/documents - Get all documents with search and pagination
router.get('/', validateSearchParams, getAllDocuments);

// GET /api/documents/stats - Get document statistics
router.get('/stats', getDocumentStats);

// GET /api/documents/:id - Get single document
router.get('/:id', getDocumentById);

// POST /api/documents - Create new document
router.post('/', upload.single('file'), validateDocument, createDocument);

// PUT /api/documents/:id - Update document
router.put('/:id', validateDocument, updateDocument);

// DELETE /api/documents/:id - Delete document
router.delete('/:id', deleteDocument);

// GET /api/documents/download/:filename - Download file
router.get('/download/:filename', downloadFile);

export default router;
