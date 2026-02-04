/**
 * Vercel Serverless Function: Chat Endpoint
 */

const RAGEngine = require('../app/rag-engine');
const { requireAuth } = require('./auth');

let ragEngine;
let initPromise;

async function initializeRAG() {
  if (!ragEngine) {
    if (!initPromise) {
      initPromise = (async () => {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          throw new Error('OPENAI_API_KEY not found');
        }
        ragEngine = new RAGEngine(apiKey);
        await ragEngine.initialize();
      })();
    }
    await initPromise;
  }
  return ragEngine;
}

async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-Access-Password');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    console.log(`[${new Date().toISOString()}] Query: ${message}`);
    
    // Initialize RAG engine
    const engine = await initializeRAG();
    
    // Get response
    const result = await engine.chat(message);
    
    console.log(`✓ Response generated (${result.sources.length} sources used)`);
    
    return res.status(200).json({
      answer: result.answer,
      sources: result.sources,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error handling chat request:', error);
    return res.status(500).json({
      error: 'Failed to generate response',
      message: error.message
    });
  }
}

module.exports = requireAuth(handler);
