#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Document from '../models/Document.js';

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/arsip_web');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

const setupDatabase = async () => {
  console.log('🗄️  Setting up database...\n');

  try {
    // Connect to database
    await connectDB();

    // Create indexes
    console.log('📊 Creating database indexes...');
    await Document.collection.createIndex({ title: 'text', description: 'text' });
    await Document.collection.createIndex({ uploadDate: -1 });
    await Document.collection.createIndex({ isActive: 1 });
    console.log('✅ Indexes created successfully');

    // Check if we need to seed data
    const documentCount = await Document.countDocuments();
    
    if (documentCount === 0) {
      console.log('\n🌱 Seeding sample data...');
      
      const sampleDocuments = [
        {
          title: 'Surat Keputusan No. 123/2024',
          description: 'Surat keputusan tentang pembentukan tim kerja proyek A',
          fileName: 'sample-1.pdf',
          originalFileName: 'SK-123-2024.pdf',
          filePath: './uploads/sample-1.pdf',
          fileUrl: '/api/documents/download/sample-1.pdf',
          fileSize: 245000,
          mimeType: 'application/pdf'
        },
        {
          title: 'Laporan Keuangan Q1 2024',
          description: 'Laporan keuangan triwulan pertama tahun 2024',
          fileName: 'sample-2.xlsx',
          originalFileName: 'Laporan-Q1-2024.xlsx',
          filePath: './uploads/sample-2.xlsx',
          fileUrl: '/api/documents/download/sample-2.xlsx',
          fileSize: 512000,
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        {
          title: 'Kontrak Kerjasama PT ABC',
          description: 'Dokumen kontrak kerjasama dengan PT ABC Indonesia untuk periode 2024-2025',
          fileName: 'sample-3.pdf',
          originalFileName: 'Kontrak-ABC.pdf',
          filePath: './uploads/sample-3.pdf',
          fileUrl: '/api/documents/download/sample-3.pdf',
          fileSize: 1024000,
          mimeType: 'application/pdf'
        }
      ];

      await Document.insertMany(sampleDocuments);
      console.log(`✅ ${sampleDocuments.length} sample documents created`);
    } else {
      console.log(`📄 Database already has ${documentCount} documents`);
    }

    // Show database stats
    console.log('\n📊 Database Statistics:');
    const totalDocs = await Document.countDocuments();
    const activeDocs = await Document.countDocuments({ isActive: true });
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const currentMonthDocs = await Document.countDocuments({
      isActive: true,
      uploadDate: { $gte: currentMonth }
    });

    console.log(`- Total documents: ${totalDocs}`);
    console.log(`- Active documents: ${activeDocs}`);
    console.log(`- Current month uploads: ${currentMonthDocs}`);

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n💡 You can now start the server with: npm run dev');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📴 Database connection closed');
  }
};

// Run setup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
}

export default setupDatabase;
