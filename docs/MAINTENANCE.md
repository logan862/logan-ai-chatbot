# Maintenance Guide 🔧

How to maintain and update Logan's AI Chatbot.

## Regular Maintenance Tasks

### Weekly
- [ ] Check server logs for errors
- [ ] Monitor API usage/costs
- [ ] Review member feedback

### Monthly
- [ ] Update knowledge base with new content
- [ ] Check for security updates (`npm audit`)
- [ ] Review and optimize slow queries
- [ ] Backup embeddings and data

### Quarterly
- [ ] Major knowledge base refresh
- [ ] Performance optimization
- [ ] Cost analysis
- [ ] Member satisfaction survey

## Adding New Content

### New YouTube Videos

1. **Download transcript:**
   ```bash
   cd knowledge/youtube
   yt-dlp --skip-download --write-auto-sub --sub-lang en \
     --convert-subs srt --output "VIDEO_ID" \
     "https://www.youtube.com/watch?v=VIDEO_ID"
   ```

2. **Create markdown file:**
   ```bash
   # Use the format from existing files
   # Title, URL, Video ID, Transcript
   ```

3. **Rebuild knowledge base:**
   ```bash
   cd ../..
   python3 build_knowledge_base.py
   ```

4. **Delete old embeddings:**
   ```bash
   rm embeddings.json
   ```

5. **Restart server** (will auto-regenerate embeddings):
   ```bash
   npm start
   # Or: pm2 restart logan-ai
   ```

### New TikTok Posts

1. **Scrape new posts:**
   ```bash
   cd knowledge/tiktok
   yt-dlp --flat-playlist --print "%(id)s|%(title)s|%(description)s" \
     "https://www.tiktok.com/@logancuffari" > tiktok_posts_new.txt
   ```

2. **Process new content:**
   ```bash
   python3 process_tiktok.py
   ```

3. **Follow steps 3-5 from above**

### Batch Update (Recommended)

For adding multiple pieces of content:

```bash
# 1. Add all new files to knowledge/ directories
# 2. Run full rebuild
npm run build-kb

# 3. Clear embeddings cache
rm embeddings.json

# 4. Restart
pm2 restart logan-ai
```

## Monitoring & Debugging

### Check Server Health

```bash
# HTTP health check
curl https://your-domain.com/health

# Should return:
# {"status":"healthy","timestamp":"2024-XX-XX..."}
```

### View Logs

```bash
# PM2 logs (if using PM2)
pm2 logs logan-ai

# Last 100 lines
pm2 logs logan-ai --lines 100

# Only errors
pm2 logs logan-ai --err

# Raw log file (if using standard output)
tail -f /var/log/logan-ai.log
```

### Monitor API Usage

Check OpenAI dashboard:
1. Go to https://platform.openai.com/usage
2. Review daily/monthly usage
3. Set up billing alerts

### Common Issues

#### High Memory Usage

**Symptom:** Server crashes or slow responses

**Fix:**
```bash
# Check memory
free -h

# Increase server RAM or optimize embeddings
# Consider storing embeddings in chunks
```

#### Slow Responses

**Symptom:** Queries take >10 seconds

**Fix:**
1. Check if embeddings are loaded in memory
2. Verify OpenAI API response time
3. Consider caching frequent queries
4. Optimize chunk sizes

#### Embeddings Not Loading

**Symptom:** "No embeddings found" error

**Fix:**
```bash
# Verify file exists
ls -lh embeddings.json

# Check file permissions
chmod 644 embeddings.json

# If corrupted, regenerate
rm embeddings.json
npm start
```

#### API Rate Limits

**Symptom:** "Rate limit exceeded" errors

**Fix:**
1. Check OpenAI rate limits: https://platform.openai.com/account/limits
2. Upgrade OpenAI tier if needed
3. Implement client-side rate limiting
4. Add retry logic with exponential backoff

## Performance Optimization

### 1. Optimize Embeddings

Current approach loads all embeddings in memory. For large knowledge bases:

```javascript
// Consider using a vector database
// Options: Pinecone, Weaviate, Qdrant

// Or implement lazy loading
const embeddingsCache = new Map();
function getEmbedding(id) {
  if (!embeddingsCache.has(id)) {
    // Load from disk only when needed
  }
  return embeddingsCache.get(id);
}
```

### 2. Implement Caching

Cache frequent queries:

```javascript
const cache = new Map();
const CACHE_TTL = 3600000; // 1 hour

async function getCachedResponse(query) {
  const cached = cache.get(query);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.response;
  }
  
  const response = await ragEngine.chat(query);
  cache.set(query, { response, timestamp: Date.now() });
  return response;
}
```

### 3. Reduce Chunk Overlap

Optimize knowledge base chunking:
- Smaller chunks = more granular search but more embeddings
- Larger chunks = fewer embeddings but less precise

Current: 2000 words per chunk
Optimize: Test 1500 or 1000 words

### 4. Use Faster Embedding Model

Current: `text-embedding-3-small` (good balance)
Alternatives:
- `text-embedding-3-large` (more accurate, slower, costlier)
- `text-embedding-ada-002` (faster, cheaper, less accurate)

## Security Updates

### Check for Vulnerabilities

```bash
# Audit dependencies
npm audit

# Fix automatically (when safe)
npm audit fix

# Review and fix manually
npm audit fix --force
```

### Update Dependencies

```bash
# Check outdated packages
npm outdated

# Update specific package
npm update openai

# Update all (carefully!)
npm update
```

### Environment Security

- [ ] Rotate API keys quarterly
- [ ] Use environment variables (never commit .env)
- [ ] Implement rate limiting
- [ ] Setup CORS properly
- [ ] Use HTTPS only
- [ ] Monitor logs for suspicious activity

## Backup Strategy

### What to Backup

**Critical:**
- `embeddings.json` (takes 5-10 min to regenerate)
- `knowledge-base.md`
- `content-metadata.json`
- `.env` (securely!)

**Nice to have:**
- `knowledge/` directory
- `topic-index.json`

### Backup Script

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/$DATE"

mkdir -p $BACKUP_DIR

# Backup critical files
cp embeddings.json $BACKUP_DIR/
cp knowledge-base.md $BACKUP_DIR/
cp content-metadata.json $BACKUP_DIR/
cp .env $BACKUP_DIR/.env.backup

# Backup knowledge directory
cp -r knowledge/ $BACKUP_DIR/

# Create archive
tar -czf "backup_$DATE.tar.gz" $BACKUP_DIR

echo "✓ Backup created: backup_$DATE.tar.gz"
```

### Restore from Backup

```bash
# Extract backup
tar -xzf backup_YYYYMMDD_HHMMSS.tar.gz

# Copy files back
cp backups/YYYYMMDD_HHMMSS/embeddings.json ./
cp backups/YYYYMMDD_HHMMSS/knowledge-base.md ./

# Restart server
pm2 restart logan-ai
```

## Knowledge Base Quality

### Review Accuracy

Periodically test chatbot with known questions:

```bash
# Create test suite
node test/test-accuracy.js
```

Sample test questions:
1. "How do I find viral products?" → Should cite specific videos
2. "What's Kelly's success story?" → Should reference $20k case study
3. "How to grow to 5000 followers?" → Should give step-by-step

### Improve Responses

If responses aren't accurate:

1. **Add more context** to knowledge base
2. **Improve system prompt** in `rag-engine.js`
3. **Adjust similarity threshold** for retrieval
4. **Add explicit examples** of good responses

### Update Personality

Logan's teaching style might evolve. Update system prompt:

```javascript
// In rag-engine.js
const systemPrompt = `You are Logan Cuffari's AI assistant...
- [Update personality traits]
- [Add new phrases he commonly uses]
- [Adjust tone as needed]
`;
```

## Cost Management

### Monitor Spending

Track monthly costs:
- OpenAI API usage
- Server hosting
- Domain/SSL

### Optimize Costs

1. **Use cheaper models when appropriate**
   - Embeddings: text-embedding-3-small (current)
   - Chat: Consider GPT-3.5-turbo for simple queries

2. **Implement caching** (see above)

3. **Batch operations**
   - Create embeddings in batches
   - Reuse embeddings when possible

4. **Set spending limits** in OpenAI dashboard

### Cost Breakdown

Typical monthly costs for 1,000 queries:
- Embeddings (queries): $0.20
- GPT-4 responses: $20-40
- **Total OpenAI:** ~$25/month

For 10,000 queries:
- **Total OpenAI:** ~$200-250/month

## Upgrading

### Add New Features

Popular requests:
- Discord bot integration
- Conversation history
- Voice input/output
- Mobile app
- Multi-language support

### Migration Checklist

When moving to new server:

- [ ] Backup all data
- [ ] Install dependencies on new server
- [ ] Copy `.env` file
- [ ] Copy `embeddings.json`
- [ ] Test locally first
- [ ] Update DNS
- [ ] Monitor for issues

## Getting Help

### Debugging Steps

1. **Check logs** first
2. **Test individual components:**
   - Can you reach /health?
   - Does /api/stats work?
   - Test with curl before blaming frontend
3. **Verify environment variables**
4. **Check OpenAI API status**
5. **Review recent changes**

### Support Resources

- OpenAI docs: https://platform.openai.com/docs
- Express.js docs: https://expressjs.com
- Node.js troubleshooting
- PM2 documentation

---

**Questions?** Review logs and test systematically. Most issues are config or API-related.
