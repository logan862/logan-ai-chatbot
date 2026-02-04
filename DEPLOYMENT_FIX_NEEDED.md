# Deployment Fix Required

## Current Issue
The chatbot fails on Vercel with error:
```
EROFS: read-only file system, open '/var/task/embeddings.json'
```

## What I've Done
1. ✅ Updated voice/system prompt (COMPLETE - main task done)
2. ✅ Modified code to handle read-only filesystem
3. ✅ Created script to generate embeddings locally
4. ⚠️ Embeddings still need to be generated

## What Needs to Happen

### Option 1: Generate Embeddings (Recommended)
Logan needs to run this locally with his OpenAI API key:

```bash
cd /Users/logancuffari/.openclaw/workspace/logan-ai-bot

# Set OpenAI API key (get from platform.openai.com)
export OPENAI_API_KEY=sk-proj-...

# Generate embeddings
node generate-embeddings.js

# Commit and push
git add embeddings.json
git commit -m "Add pre-generated embeddings for Vercel deployment"
git push origin main
```

This will:
- Process all knowledge base content (YouTube, TikTok, courses)
- Create vector embeddings for RAG search
- Save to `embeddings.json` (will be ~2-5MB)
- Vercel will auto-deploy when pushed

**Note:** This may take 5-10 minutes and cost ~$2-5 in OpenAI API credits depending on content volume.

### Option 2: Quick Fix (Temporary)
If embeddings generation fails or takes too long, Logan can:

1. Create a minimal embeddings file for testing:
```bash
echo '[]' > embeddings.json
git add embeddings.json
git commit -m "Add empty embeddings for testing"
git push
```

This will make the site load, but the chatbot won't have knowledge to answer questions properly.

## Files Changed (Already Committed)

1. `app/rag-engine.js` - Voice prompt + read-only filesystem handling
2. `generate-embeddings.js` - New script to generate embeddings locally
3. `VOICE_TRAINING_COMPLETE.md` - Documentation of voice training
4. This file - Instructions for fixing deployment

## Next Steps

**For Logan:**
1. Get OpenAI API key from https://platform.openai.com/api-keys
2. Run `generate-embeddings.js` script (shown above)
3. Commit and push `embeddings.json`
4. Verify deployment at https://logan-ai-chatbot.vercel.app/

**Estimated Time:** 15-20 minutes (mostly waiting for embeddings to generate)

## Why This Happened

The RAG (Retrieval-Augmented Generation) system needs to create vector embeddings of all knowledge base content (YouTube transcripts, TikTok captions, course content) to enable semantic search. 

These embeddings were meant to be generated automatically, but Vercel's serverless environment has a read-only filesystem, so we can't generate and save them on-the-fly.

Solution: Generate once locally, commit to repo, deploy.

---

## Voice Training Status: ✅ COMPLETE

The main task (training chatbot to sound like Logan) is DONE:
- Analyzed 1,390 Discord messages
- Updated system prompt to match his voice
- Code committed and pushed

The deployment issue is a separate technical problem that needs the embeddings file to exist.
