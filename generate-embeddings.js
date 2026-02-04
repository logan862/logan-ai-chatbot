/**
 * Generate embeddings locally for deployment
 * Run this script before deploying to Vercel
 */

const RAGEngine = require('./app/rag-engine');

async function generateEmbeddings() {
  console.log('Starting embedding generation...\n');
  
  // Get API key from environment
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY not found in environment');
    console.error('Please set it first: export OPENAI_API_KEY=sk-...');
    process.exit(1);
  }
  
  try {
    // Set to development mode to allow file writing
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    const ragEngine = new RAGEngine(apiKey);
    await ragEngine.initialize();
    
    process.env.NODE_ENV = originalEnv;
    
    console.log('\n✅ Embeddings generated successfully!');
    console.log('📁 File saved: embeddings.json');
    console.log('\nNext steps:');
    console.log('  1. git add embeddings.json');
    console.log('  2. git commit -m "Add pre-generated embeddings"');
    console.log('  3. git push origin main');
    console.log('\nVercel will automatically deploy the updated code.');
    
  } catch (error) {
    console.error('\n❌ Error generating embeddings:', error.message);
    process.exit(1);
  }
}

generateEmbeddings();
