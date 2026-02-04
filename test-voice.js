/**
 * Quick test to verify Logan's voice in responses
 */

require('dotenv').config();
const RAGEngine = require('./app/rag-engine');

async function testVoice() {
  console.log('Testing Logan AI voice...\n');
  
  const ragEngine = new RAGEngine(process.env.OPENAI_API_KEY);
  await ragEngine.initialize();
  
  const testQuestions = [
    "How do I find good products to sell on TikTok Shop?",
    "My videos aren't getting any views, what should I do?",
    "Should I use hashtags on my TikTok Shop videos?"
  ];
  
  for (const question of testQuestions) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Q: ${question}`);
    console.log('='.repeat(60));
    
    try {
      const result = await ragEngine.chat(question);
      console.log(`\nA: ${result.answer}\n`);
      console.log(`Sources used: ${result.sources.length}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }
  
  console.log('\n✓ Voice test complete\n');
}

testVoice().catch(console.error);
