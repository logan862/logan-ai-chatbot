/**
 * Test script for Logan AI Chatbot
 * Verifies all components are working
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000';

const testQuestions = [
  {
    question: "How do I find viral products for TikTok Shop?",
    expectedTopics: ['product', 'research', 'viral']
  },
  {
    question: "How did Kelly make $20,832 last month?",
    expectedTopics: ['Kelly', 'case study', '$20']
  },
  {
    question: "What's the best content strategy for beginners?",
    expectedTopics: ['content', 'strategy', 'beginner']
  },
  {
    question: "How do I grow my account to 5000 followers?",
    expectedTopics: ['grow', 'followers', '5000']
  },
  {
    question: "How do I use AI to make money on TikTok Shop?",
    expectedTopics: ['AI', 'automate', 'strategy']
  }
];

async function testHealthCheck() {
  console.log('🔍 Testing health check...');
  try {
    const response = await axios.get(`${API_URL}/health`);
    if (response.data.status === 'healthy') {
      console.log('✅ Health check passed\n');
      return true;
    }
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function testStats() {
  console.log('🔍 Testing stats endpoint...');
  try {
    const response = await axios.get(`${API_URL}/api/stats`);
    console.log('📊 Knowledge Base Stats:');
    console.log(`   - Total Content: ${response.data.totalContent}`);
    console.log(`   - YouTube Videos: ${response.data.youtubeVideos}`);
    console.log(`   - TikTok Posts: ${response.data.tiktokPosts}`);
    console.log(`   - Total Embeddings: ${response.data.totalEmbeddings}`);
    console.log('✅ Stats endpoint working\n');
    return true;
  } catch (error) {
    console.error('❌ Stats endpoint failed:', error.message);
    return false;
  }
}

async function testSearch() {
  console.log('🔍 Testing search endpoint...');
  try {
    const response = await axios.post(`${API_URL}/api/search`, {
      query: 'viral products',
      limit: 3
    });
    
    if (response.data.results && response.data.results.length > 0) {
      console.log(`✅ Search found ${response.data.results.length} results`);
      console.log(`   Top result: "${response.data.results[0].title}"\n`);
      return true;
    } else {
      console.error('❌ Search returned no results\n');
      return false;
    }
  } catch (error) {
    console.error('❌ Search failed:', error.message);
    return false;
  }
}

async function testChat(question, expectedTopics) {
  console.log(`🔍 Testing: "${question}"`);
  
  const startTime = Date.now();
  
  try {
    const response = await axios.post(`${API_URL}/api/chat`, {
      message: question
    });
    
    const duration = Date.now() - startTime;
    
    if (!response.data.answer) {
      console.error('❌ No answer received\n');
      return false;
    }
    
    const answer = response.data.answer.toLowerCase();
    const matchedTopics = expectedTopics.filter(topic => 
      answer.includes(topic.toLowerCase())
    );
    
    console.log(`✅ Response received in ${duration}ms`);
    console.log(`   Answer length: ${response.data.answer.length} chars`);
    console.log(`   Sources cited: ${response.data.sources.length}`);
    console.log(`   Topics matched: ${matchedTopics.length}/${expectedTopics.length}`);
    
    // Show preview
    const preview = response.data.answer.slice(0, 150).replace(/\n/g, ' ');
    console.log(`   Preview: "${preview}..."`);
    
    if (response.data.sources.length > 0) {
      console.log(`   Top source: ${response.data.sources[0].title}`);
    }
    
    console.log('');
    return true;
    
  } catch (error) {
    console.error('❌ Chat failed:', error.message);
    console.log('');
    return false;
  }
}

async function runTests() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   Logan AI Chatbot - Test Suite            ║');
  console.log('╚══════════════════════════════════════════════╝\n');
  console.log(`Testing API at: ${API_URL}\n`);
  
  const results = {
    passed: 0,
    failed: 0,
    total: 0
  };
  
  // Test 1: Health Check
  results.total++;
  if (await testHealthCheck()) {
    results.passed++;
  } else {
    results.failed++;
    console.log('\n⚠️  Server is not healthy. Stopping tests.\n');
    return;
  }
  
  // Test 2: Stats
  results.total++;
  if (await testStats()) {
    results.passed++;
  } else {
    results.failed++;
  }
  
  // Test 3: Search
  results.total++;
  if (await testSearch()) {
    results.passed++;
  } else {
    results.failed++;
  }
  
  // Test 4-8: Chat with various questions
  console.log('🔍 Testing chat with sample questions...\n');
  
  for (const test of testQuestions) {
    results.total++;
    if (await testChat(test.question, test.expectedTopics)) {
      results.passed++;
    } else {
      results.failed++;
    }
    
    // Pause between requests to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║              Test Results                    ║');
  console.log('╚══════════════════════════════════════════════╝\n');
  console.log(`✅ Passed: ${results.passed}/${results.total}`);
  console.log(`❌ Failed: ${results.failed}/${results.total}`);
  console.log(`📊 Success Rate: ${Math.round(results.passed / results.total * 100)}%\n`);
  
  if (results.failed === 0) {
    console.log('🎉 All tests passed! Chatbot is working correctly.\n');
  } else {
    console.log('⚠️  Some tests failed. Check logs above for details.\n');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('\n❌ Test suite failed:', error);
  process.exit(1);
});
