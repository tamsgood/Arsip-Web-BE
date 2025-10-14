// Simple API testing script
// Run with: node test-api.js

const API_BASE = 'http://localhost:3001/api';

async function testAPI() {
  console.log('🧪 Testing Arsip Web API...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await fetch(`${API_BASE.replace('/api', '')}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);
    console.log('');

    // Test get all documents
    console.log('2. Testing get all documents...');
    const documentsResponse = await fetch(`${API_BASE}/documents`);
    const documentsData = await documentsResponse.json();
    console.log('✅ Documents retrieved:', documentsData.data?.documents?.length || 0, 'documents');
    console.log('📊 Statistics:', documentsData.data?.statistics);
    console.log('');

    // Test get document stats
    console.log('3. Testing document stats...');
    const statsResponse = await fetch(`${API_BASE}/documents/stats`);
    const statsData = await statsResponse.json();
    console.log('✅ Stats retrieved:', statsData.data);
    console.log('');

    // Test search functionality
    console.log('4. Testing search functionality...');
    const searchResponse = await fetch(`${API_BASE}/documents?search=test`);
    const searchData = await searchResponse.json();
    console.log('✅ Search results:', searchData.data?.documents?.length || 0, 'documents found');
    console.log('');

    console.log('🎉 All API tests completed successfully!');
    console.log('\n📝 Available endpoints:');
    console.log('- GET /health - Health check');
    console.log('- GET /api/documents - Get all documents');
    console.log('- GET /api/documents/stats - Get statistics');
    console.log('- POST /api/documents - Upload document');
    console.log('- PUT /api/documents/:id - Update document');
    console.log('- DELETE /api/documents/:id - Delete document');
    console.log('- GET /api/documents/download/:filename - Download file');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('1. Server is running on port 3001');
    console.log('2. MongoDB is connected');
    console.log('3. No CORS issues');
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testAPI();
}

export default testAPI;
