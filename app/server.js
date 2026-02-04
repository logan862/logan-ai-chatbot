/**
 * Logan AI Chatbot API Server
 * Express server with RAG-powered chat endpoint
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const RAGEngine = require('./rag-engine');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize RAG engine
let ragEngine;

async function initializeServer() {
  try {
    console.log('Starting Logan AI Chatbot server...\n');
    
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not found in environment variables');
    }
    
    ragEngine = new RAGEngine(apiKey);
    await ragEngine.initialize();
    
    console.log('\n✓ Server ready!\n');
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    console.log(`\n[${new Date().toISOString()}] Query: ${message}`);
    
    // Get response from RAG engine
    const result = await ragEngine.chat(message);
    
    console.log(`✓ Response generated (${result.sources.length} sources used)`);
    
    res.json({
      answer: result.answer,
      sources: result.sources,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error handling chat request:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      message: error.message
    });
  }
});

// Get knowledge base stats
app.get('/api/stats', async (req, res) => {
  try {
    const stats = {
      totalEmbeddings: ragEngine.embeddings.length,
      totalContent: ragEngine.contentMetadata.length,
      youtubeVideos: ragEngine.contentMetadata.filter(c => c.source === 'YouTube').length,
      tiktokPosts: ragEngine.contentMetadata.filter(c => c.source === 'TikTok').length
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search knowledge base
app.post('/api/search', async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    const results = await ragEngine.search(query, limit);
    
    res.json({
      results: results.map(r => ({
        title: r.title,
        url: r.url,
        source: r.source,
        topics: r.topics,
        similarity: r.similarity,
        snippet: r.text.slice(0, 200) + '...'
      }))
    });
  } catch (error) {
    console.error('Error handling search request:', error);
    res.status(500).json({
      error: 'Failed to search',
      message: error.message
    });
  }
});

// Start server
async function start() {
  await initializeServer();
  
  app.listen(PORT, () => {
    console.log(`\n🚀 Logan AI Chatbot API running on http://localhost:${PORT}`);
    console.log(`\nAvailable endpoints:`);
    console.log(`  POST /api/chat       - Chat with Logan's AI`);
    console.log(`  POST /api/search     - Search knowledge base`);
    console.log(`  GET  /api/stats      - Get statistics`);
    console.log(`  GET  /health         - Health check`);
    console.log(`\n`);
  });
}

start();
