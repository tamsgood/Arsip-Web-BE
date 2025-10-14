import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Judul dokumen harus diisi'],
    trim: true,
    maxlength: [200, 'Judul dokumen tidak boleh lebih dari 200 karakter']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Deskripsi tidak boleh lebih dari 1000 karakter']
  },
  fileName: {
    type: String,
    required: [true, 'Nama file harus ada'],
    trim: true
  },
  originalFileName: {
    type: String,
    required: [true, 'Nama file asli harus ada'],
    trim: true
  },
  filePath: {
    type: String,
    required: [true, 'Path file harus ada']
  },
  fileUrl: {
    type: String,
    required: [true, 'URL file harus ada']
  },
  fileSize: {
    type: Number,
    required: [true, 'Ukuran file harus ada'],
    min: [0, 'Ukuran file tidak boleh negatif']
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type harus ada']
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Index untuk pencarian
documentSchema.index({ title: 'text', description: 'text' });
documentSchema.index({ uploadDate: -1 });
documentSchema.index({ isActive: 1 });

// Middleware untuk update lastModified
documentSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModified = new Date();
  }
  next();
});

const Document = mongoose.model('Document', documentSchema);

export default Document;
