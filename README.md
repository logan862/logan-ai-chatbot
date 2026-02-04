# Logan AI Chatbot - TikTok Shop Expert 🚀

An AI-powered chatbot trained on all of Logan Cuffari's TikTok Shop knowledge, providing 24/7 support to coaching program members.

## 📋 Overview

This chatbot uses Retrieval-Augmented Generation (RAG) to provide accurate, Logan-style answers to TikTok Shop questions. It's trained on:

- **11 YouTube videos** with full transcripts (~21,000 words)
- **209 TikTok posts** with captions and teaching points
- **9 core topic areas** covering TikTok Shop strategies

## ✨ Features

- **Intelligent RAG System** - Searches knowledge base and generates contextual responses
- **Source Citations** - Every answer includes links to source videos/posts
- **Logan's Voice** - Mimics Logan's teaching style and personality
- **Fast Responses** - Optimized vector search for sub-second retrieval
- **Web Interface** - Beautiful, responsive chat UI
- **REST API** - Easy integration with other platforms

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- Python 3.8+
- OpenAI API key

### Installation

1. **Clone and navigate to project:**
   ```bash
   cd logan-ai-bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your OPENAI_API_KEY
   ```

4. **Initialize embeddings (first-time only):**
   ```bash
   # This creates vector embeddings from the knowledge base
   # Takes ~5-10 minutes for all content
   npm start
   # The server will auto-create embeddings on first run
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

6. **Open browser:**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
logan-ai-bot/
├── knowledge/              # Source content
│   ├── youtube/           # Video transcripts (11 files)
│   ├── tiktok/            # TikTok posts (209 files)
│   └── instagram/         # Instagram content (TBD)
├── app/
│   ├── server.js          # Express API server
│   ├── rag-engine.js      # RAG logic & embeddings
│   └── public/
│       └── index.html     # Chat interface
├── knowledge-base.md      # Consolidated knowledge
├── topic-index.json       # Searchable topic index
├── content-metadata.json  # Content metadata
├── embeddings.json        # Vector embeddings (auto-generated)
└── docs/                  # Documentation
```

## 🔧 API Endpoints

### Chat
```bash
POST /api/chat
{
  "message": "How do I find viral products for TikTok Shop?"
}

Response:
{
  "answer": "Here's how to find viral products...",
  "sources": [
    {
      "title": "Video Title",
      "url": "https://youtube.com/watch?v=...",
      "source": "YouTube",
      "similarity": 0.89
    }
  ]
}
```

### Search Knowledge Base
```bash
POST /api/search
{
  "query": "product research",
  "limit": 5
}
```

### Get Stats
```bash
GET /api/stats

Response:
{
  "totalEmbeddings": 145,
  "totalContent": 123,
  "youtubeVideos": 11,
  "tiktokPosts": 112
}
```

## 🧪 Testing

Test the chatbot with sample questions:

```bash
npm test
```

Example queries to try:
- "How do I find viral products for TikTok Shop?"
- "What's the best content strategy for beginners?"
- "How did Kelly make $20k last month?"
- "How to grow from 0 to 5000 followers?"

## 📊 Knowledge Base Statistics

- **YouTube Videos:** 11 (full transcripts)
- **TikTok Posts:** 209 (captions + teaching points)
- **Total Embeddings:** ~145 chunks
- **Topics Covered:** 9 core areas
  - TikTok Shop Strategies
  - Product Research
  - Content Creation
  - Account Growth
  - Revenue & Monetization
  - Problems & Solutions
  - Case Studies
  - Technical Setup
  - Advanced Techniques

## 🔄 Updating Knowledge Base

When new content is added:

1. **Add new transcripts** to `knowledge/youtube/` or `knowledge/tiktok/`
2. **Rebuild knowledge base:**
   ```bash
   npm run build-kb
   ```
3. **Delete old embeddings:**
   ```bash
   rm embeddings.json
   ```
4. **Restart server** (will auto-create new embeddings)

## 🚢 Deployment

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment instructions for:
- Vercel
- Railway
- Heroku
- AWS/DigitalOcean

## 📖 Additional Documentation

- [DEPLOYMENT.md](docs/DEPLOYMENT.md) - Deployment instructions
- [USAGE.md](docs/USAGE.md) - How members use the chatbot
- [MAINTENANCE.md](docs/MAINTENANCE.md) - Updating and maintaining
- [INTEGRATION.md](docs/INTEGRATION.md) - Whop/Discord integration

## 🛠️ Tech Stack

- **Backend:** Node.js + Express
- **AI:** OpenAI GPT-4 + Embeddings API
- **Vector Search:** Custom cosine similarity
- **Frontend:** Vanilla HTML/CSS/JS (lightweight)
- **Knowledge:** YouTube transcripts + TikTok captions

## 💡 How It Works

1. **Knowledge Extraction:** Transcripts extracted from YouTube/TikTok
2. **Embedding Creation:** Content converted to vector embeddings
3. **Query Processing:** User question embedded and matched via cosine similarity
4. **Context Retrieval:** Top 5 most relevant content chunks retrieved
5. **Response Generation:** GPT-4 generates Logan-style response with context
6. **Source Citation:** Sources automatically included in response

## 📝 License

Private - For Logan Cuffari's coaching program only

## 🤝 Support

For technical support or questions:
- Check [MAINTENANCE.md](docs/MAINTENANCE.md)
- Review API logs in console
- Test individual components with npm test

---

**Built for Logan Cuffari's TikTok Shop Coaching Program**
