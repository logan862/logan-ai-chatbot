# Quick Start Guide ⚡

Get Logan's AI Chatbot running in 10 minutes.

## Prerequisites

✅ Node.js 16+ installed  
✅ OpenAI API key ([get one here](https://platform.openai.com/api-keys))  
✅ Terminal/command line access  

## Step 1: Setup (2 minutes)

```bash
# Navigate to project
cd logan-ai-bot

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

## Step 2: Add API Key (1 minute)

Edit `.env` file:
```bash
OPENAI_API_KEY=sk-your-key-here
PORT=3000
NODE_ENV=development
```

## Step 3: Start Server (5-10 minutes first time)

```bash
npm start
```

**First run takes 5-10 minutes** to create embeddings from knowledge base.  
Subsequent starts are instant (loads from `embeddings.json`).

You'll see:
```
Initializing RAG engine...
Creating embeddings for knowledge base...
  ✓ Video 1/11...
  ✓ Video 2/11...
  ...
✓ Created and saved 145 embeddings
✓ RAG engine initialized
🚀 Logan AI Chatbot API running on http://localhost:3000
```

## Step 4: Test (1 minute)

Open browser: **http://localhost:3000**

Try these questions:
- "How do I find viral products for TikTok Shop?"
- "How did Kelly make $20k last month?"
- "What's the best content strategy?"

## Step 5: Deploy to Production (10 minutes)

### Option A: Railway (Recommended)

1. Push to GitHub
2. Go to [Railway.app](https://railway.app)
3. "New Project" → "Deploy from GitHub"
4. Select your repo
5. Add environment variable: `OPENAI_API_KEY`
6. Deploy
7. Get your URL: `https://your-app.up.railway.app`

### Option B: Vercel

```bash
npm install -g vercel
vercel
# Follow prompts
vercel env add OPENAI_API_KEY production
vercel --prod
```

## Step 6: Share with Members

Send them the link:
```
💬 Logan AI - Your 24/7 TikTok Shop Expert
https://your-domain.com

Ask me anything about TikTok Shop strategies, product research, content creation, and more!
```

## Troubleshooting

### "OPENAI_API_KEY not found"
→ Make sure `.env` file exists and has valid API key

### "Module not found"
→ Run `npm install` again

### "Embeddings taking forever"
→ Normal on first run (5-10 min). Coffee break! ☕

### "Port 3000 already in use"
→ Change `PORT=3001` in `.env`

### API errors
→ Check OpenAI API key is valid and has credits

## Quick Commands

```bash
# Start server
npm start

# Run tests
npm test

# Rebuild knowledge base (after adding content)
npm run build-kb

# Check what's running
curl http://localhost:3000/health
```

## Next Steps

1. ✅ Read [README.md](README.md) for full features
2. ✅ Check [DEPLOYMENT.md](docs/DEPLOYMENT.md) for production tips
3. ✅ Review [USAGE.md](docs/USAGE.md) to share with members
4. ✅ See [INTEGRATION.md](docs/INTEGRATION.md) for Whop/Discord setup

## Support

**Common Issues:**
- Slow responses → Check OpenAI API status
- Wrong answers → Review knowledge base sources
- Crashes → Check logs (`pm2 logs` if using PM2)

**Need help?**
- Check documentation in `docs/` folder
- Review code comments
- Test individual components with `npm test`

---

**You're ready! 🚀 Deploy and share with members.**

Total setup time: **10 minutes** (excluding first-time embedding creation)
