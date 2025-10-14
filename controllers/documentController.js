import Document from '../models/Document.js';
import path from 'path';
import fs from 'fs-extra';
import { validationResult } from 'express-validator';

// GET /api/documents - Get all documents
export const getAllDocuments = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, sortBy = 'uploadDate', sortOrder = 'desc' } = req.query;
    
    // Build query
    let query = { isActive: true };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { originalFileName: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const documents = await Document.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    // Get total count for pagination
    const total = await Document.countDocuments(query);
    
    // Get statistics
    const totalDocuments = await Document.countDocuments({ isActive: true });
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const currentMonthUploads = await Document.countDocuments({
      isActive: true,
      uploadDate: { $gte: currentMonth }
    });
    
    res.json({
      success: true,
      data: {
        documents,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalDocuments: total,
          hasNextPage: skip + parseInt(limit) < total,
          hasPrevPage: parseInt(page) > 1
        },
        statistics: {
          totalDocuments,
          currentMonthUploads,
          searchResults: total
        }
      }
    });
  } catch (error) {
    console.error('Error getting documents:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil dokumen',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET /api/documents/:id - Get single document
export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const document = await Document.findOne({ _id: id, isActive: true });
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Dokumen tidak ditemukan'
      });
    }
    
    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Error getting document:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil dokumen',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// POST /api/documents - Create new document
export const createDocument = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Data tidak valid',
        errors: errors.array()
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File harus diupload'
      });
    }
    
    const { title, description } = req.body;
    const file = req.file;
    
    // Create file URL
    const fileUrl = `/api/documents/download/${file.filename}`;
    
    // Create document
    const document = new Document({
      title,
      description,
      fileName: file.filename,
      originalFileName: file.originalname,
      filePath: file.path,
      fileUrl,
      fileSize: file.size,
      mimeType: file.mimetype
    });
    
    await document.save();
    
    res.status(201).json({
      success: true,
      message: 'Dokumen berhasil diupload',
      data: document
    });
  } catch (error) {
    console.error('Error creating document:', error);
    
    // Clean up uploaded file if document creation fails
    if (req.file) {
      try {
        await fs.remove(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error saat mengupload dokumen',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// PUT /api/documents/:id - Update document
export const updateDocument = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Data tidak valid',
        errors: errors.array()
      });
    }
    
    const { id } = req.params;
    const { title, description } = req.body;
    
    const document = await Document.findOneAndUpdate(
      { _id: id, isActive: true },
      { 
        title, 
        description,
        lastModified: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Dokumen tidak ditemukan'
      });
    }
    
    res.json({
      success: true,
      message: 'Dokumen berhasil diupdate',
      data: document
    });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengupdate dokumen',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// DELETE /api/documents/:id - Delete document (soft delete)
export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    
    const document = await Document.findOneAndUpdate(
      { _id: id, isActive: true },
      { isActive: false },
      { new: true }
    );
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Dokumen tidak ditemukan'
      });
    }
    
    res.json({
      success: true,
      message: 'Dokumen berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat menghapus dokumen',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET /api/documents/download/:filename - Download file
export const downloadFile = async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Find document by filename
    const document = await Document.findOne({ fileName: filename, isActive: true });
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'File tidak ditemukan'
      });
    }
    
    // Check if file exists
    const filePath = path.resolve(document.filePath);
    const fileExists = await fs.pathExists(filePath);
    
    if (!fileExists) {
      return res.status(404).json({
        success: false,
        message: 'File tidak ditemukan di server'
      });
    }
    
    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${document.originalFileName}"`);
    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Content-Length', document.fileSize);
    
    // Stream file to response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error saat mengunduh file'
        });
      }
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengunduh file',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET /api/documents/stats - Get document statistics
export const getDocumentStats = async (req, res) => {
  try {
    const totalDocuments = await Document.countDocuments({ isActive: true });
    
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const currentMonthUploads = await Document.countDocuments({
      isActive: true,
      uploadDate: { $gte: currentMonth }
    });
    
    const lastMonth = new Date(currentMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthUploads = await Document.countDocuments({
      isActive: true,
      uploadDate: { $gte: lastMonth, $lt: currentMonth }
    });
    
    // Get file type statistics
    const fileTypeStats = await Document.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$mimeType',
          count: { $sum: 1 },
          totalSize: { $sum: '$fileSize' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalDocuments,
        currentMonthUploads,
        lastMonthUploads,
        fileTypeStats
      }
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil statistik',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
