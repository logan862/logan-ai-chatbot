/**
 * RAG Engine for Logan's AI Chatbot
 * Retrieval-Augmented Generation using vector embeddings
 */

const fs = require('fs').promises;
const path = require('path');
const OpenAI = require('openai');

class RAGEngine {
  constructor(apiKey) {
    this.openai = new OpenAI({ apiKey });
    this.embeddings = [];
    this.contentMetadata = [];
    this.embeddingsFile = path.join(__dirname, '..', 'embeddings.json');
  }

  /**
   * Initialize the RAG engine by loading or creating embeddings
   */
  async initialize() {
    console.log('Initializing RAG engine...');
    
    // Load content metadata
    const metadataPath = path.join(__dirname, '..', 'content-metadata.json');
    const metadataContent = await fs.readFile(metadataPath, 'utf-8');
    this.contentMetadata = JSON.parse(metadataContent);
    
    // Try to load existing embeddings
    try {
      const embeddingsContent = await fs.readFile(this.embeddingsFile, 'utf-8');
      this.embeddings = JSON.parse(embeddingsContent);
      console.log(`Loaded ${this.embeddings.length} existing embeddings`);
    } catch (error) {
      console.log('No existing embeddings found. Creating new embeddings...');
      await this.createEmbeddings();
    }
    
    console.log('✓ RAG engine initialized');
  }

  /**
   * Create embeddings for all content
   */
  async createEmbeddings() {
    console.log('Creating embeddings for knowledge base...');
    const embeddings = [];
    
    // Process YouTube content (full transcripts)
    const youtubeDir = path.join(__dirname, '..', 'knowledge', 'youtube');
    for (const item of this.contentMetadata.filter(i => i.source === 'YouTube')) {
      try {
        const content = await fs.readFile(item.filename, 'utf-8');
        
        // Split into chunks (max 8000 tokens per chunk for embedding)
        const chunks = this.splitIntoChunks(content, 2000);
        
        for (let i = 0; i < chunks.length; i++) {
          const embedding = await this.createEmbedding(chunks[i]);
          embeddings.push({
            ...item,
            chunk: i,
            totalChunks: chunks.length,
            text: chunks[i],
            embedding
          });
          console.log(`  ✓ ${item.title} (chunk ${i + 1}/${chunks.length})`);
        }
      } catch (error) {
        console.error(`  Error processing ${item.filename}:`, error.message);
      }
    }
    
    // Process TikTok content (captions)
    for (const item of this.contentMetadata.filter(i => i.source === 'TikTok')) {
      try {
        const content = await fs.readFile(item.filename, 'utf-8');
        const embedding = await this.createEmbedding(content);
        embeddings.push({
          ...item,
          chunk: 0,
          totalChunks: 1,
          text: content,
          embedding
        });
      } catch (error) {
        console.error(`  Error processing ${item.filename}:`, error.message);
      }
    }
    
    this.embeddings = embeddings;
    
    // Save embeddings to file
    await fs.writeFile(this.embeddingsFile, JSON.stringify(embeddings, null, 2));
    console.log(`✓ Created and saved ${embeddings.length} embeddings`);
  }

  /**
   * Create embedding for text using OpenAI
   */
  async createEmbedding(text) {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text.slice(0, 8000) // Truncate if too long
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error creating embedding:', error.message);
      throw error;
    }
  }

  /**
   * Split text into chunks
   */
  splitIntoChunks(text, maxWords) {
    const words = text.split(/\s+/);
    const chunks = [];
    
    for (let i = 0; i < words.length; i += maxWords) {
      chunks.push(words.slice(i, i + maxWords).join(' '));
    }
    
    return chunks;
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  /**
   * Search for relevant content based on query
   */
  async search(query, topK = 5) {
    // Create embedding for query
    const queryEmbedding = await this.createEmbedding(query);
    
    // Calculate similarity scores
    const scored = this.embeddings.map(item => ({
      ...item,
      similarity: this.cosineSimilarity(queryEmbedding, item.embedding)
    }));
    
    // Sort by similarity and return top K
    scored.sort((a, b) => b.similarity - a.similarity);
    return scored.slice(0, topK);
  }

  /**
   * Generate response using retrieved context
   */
  async generateResponse(query, context) {
    // Build context from retrieved documents
    const contextText = context.map((doc, i) => 
      `[Source ${i + 1}: ${doc.title} - ${doc.url}]\n${doc.text.slice(0, 1500)}...\n`
    ).join('\n---\n');
    
    const systemPrompt = `You are Logan Cuffari's AI assistant, trained on all of his TikTok Shop knowledge and teaching content. Your role is to help members of his coaching program get answers to their questions 24/7.

PERSONALITY & STYLE:
- Speak like Logan: direct, confident, actionable
- Use his common phrases and teaching style
- Be encouraging but realistic
- Focus on PRACTICAL, step-by-step advice
- Reference specific examples from his content
- Don't be generic - give detailed, Logan-style answers

RULES:
1. ALWAYS cite your sources using the format: (Source: [Video Title - URL])
2. If you mention a specific strategy or tactic, reference which video/post it came from
3. If the question is outside TikTok Shop knowledge, acknowledge this honestly
4. Give actionable advice, not theory
5. When relevant, mention specific numbers/results from case studies

AVAILABLE CONTEXT:
${contextText}

Answer the member's question using the context above. Be specific, cite sources, and sound like Logan.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.choices[0].message.content;
  }

  /**
   * Main chat function
   */
  async chat(query) {
    try {
      // Search for relevant content
      const relevantContent = await this.search(query, 5);
      
      // Generate response
      const response = await this.generateResponse(query, relevantContent);
      
      return {
        answer: response,
        sources: relevantContent.map(doc => ({
          title: doc.title,
          url: doc.url,
          source: doc.source,
          similarity: doc.similarity
        }))
      };
    } catch (error) {
      console.error('Error in chat:', error);
      throw error;
    }
  }
}

module.exports = RAGEngine;
