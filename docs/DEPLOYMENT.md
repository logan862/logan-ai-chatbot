# Deployment Guide 🚀

Complete guide to deploying Logan's AI Chatbot to production.

## Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest)

**Pros:** Free tier, automatic HTTPS, global CDN, zero config
**Cons:** Serverless limits (10s timeout on free tier)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables
vercel env add OPENAI_API_KEY production
```

**Important:** Add `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "app/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "app/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Option 2: Railway (Recommended - Best for Long-Running)

**Pros:** Always-on server, no timeout limits, $5/month
**Cons:** Not free

1. **Sign up:** https://railway.app
2. **Connect GitHub repo** or deploy directly
3. **Add environment variable:** `OPENAI_API_KEY`
4. **Deploy:** Automatic from git push

Railway automatically detects Node.js and runs `npm start`.

### Option 3: Heroku

**Pros:** Familiar, good ecosystem
**Cons:** $7/month minimum now

```bash
# Install Heroku CLI
brew install heroku/brew/heroku

# Login and create app
heroku login
heroku create logan-ai-chatbot

# Add environment variable
heroku config:set OPENAI_API_KEY=your_key_here

# Deploy
git push heroku main
```

Add `Procfile`:
```
web: node app/server.js
```

### Option 4: DigitalOcean/AWS (Full Control)

**Pros:** Full control, best performance
**Cons:** More setup, need to manage server

#### DigitalOcean Droplet

1. **Create droplet** (Ubuntu 22.04, $6/month)
2. **SSH into server:**
   ```bash
   ssh root@your_server_ip
   ```

3. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
   apt-get install -y nodejs
   ```

4. **Install PM2 (process manager):**
   ```bash
   npm install -g pm2
   ```

5. **Clone and setup:**
   ```bash
   git clone <your-repo>
   cd logan-ai-bot
   npm install
   ```

6. **Create .env file:**
   ```bash
   nano .env
   # Add OPENAI_API_KEY=your_key
   ```

7. **Start with PM2:**
   ```bash
   pm2 start app/server.js --name logan-ai
   pm2 save
   pm2 startup
   ```

8. **Setup Nginx reverse proxy:**
   ```bash
   apt install nginx
   ```

   Edit `/etc/nginx/sites-available/default`:
   ```nginx
   server {
       listen 80;
       server_name your_domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   systemctl restart nginx
   ```

9. **Setup SSL with Let's Encrypt:**
   ```bash
   apt install certbot python3-certbot-nginx
   certbot --nginx -d your_domain.com
   ```

## Environment Variables

Required in production:

```bash
OPENAI_API_KEY=sk-...
PORT=3000
NODE_ENV=production
```

## Performance Optimization

### 1. Cache Embeddings

Embeddings are saved to `embeddings.json` and loaded on startup. First run takes 5-10 minutes to create embeddings.

### 2. Memory Requirements

- **Minimum:** 512 MB RAM
- **Recommended:** 1 GB RAM (for embeddings in memory)

### 3. Response Time

- First query: 2-4 seconds (includes embedding creation)
- Subsequent queries: 1-2 seconds

### 4. Rate Limiting (Optional)

Add rate limiting to prevent abuse:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Custom Domain Setup

1. **Purchase domain** (Namecheap, Google Domains, etc.)
2. **Add DNS records:**
   - A record: `@` → `your_server_ip`
   - A record: `www` → `your_server_ip`
3. **Update server** to use domain
4. **Setup SSL** (see above)

## Monitoring

### Health Checks

Monitor `/health` endpoint:
```bash
curl https://your-domain.com/health
```

### Logging

PM2 logs:
```bash
pm2 logs logan-ai
```

View errors:
```bash
pm2 logs logan-ai --err
```

### Uptime Monitoring

Free options:
- **UptimeRobot:** https://uptimerobot.com
- **Better Uptime:** https://betteruptime.com
- **Pingdom:** https://pingdom.com

## Backup & Recovery

### Backup Knowledge Base

```bash
# Backup embeddings (important!)
tar -czf backup-$(date +%Y%m%d).tar.gz embeddings.json knowledge-base.md content-metadata.json
```

### Restore

```bash
tar -xzf backup-YYYYMMDD.tar.gz
pm2 restart logan-ai
```

## Scaling

### Horizontal Scaling

For high traffic, use load balancer:
1. Deploy multiple instances
2. Setup load balancer (nginx, HAProxy, or cloud LB)
3. Share embeddings file via S3 or shared volume

### Vertical Scaling

Increase server resources:
- More RAM for faster embeddings loading
- More CPU for faster response generation

## Cost Estimates

### OpenAI API Costs

**GPT-4 Turbo:**
- Input: $0.01 per 1K tokens
- Output: $0.03 per 1K tokens

**Embeddings (text-embedding-3-small):**
- $0.00002 per 1K tokens

**Estimated monthly costs:**
- 1,000 queries/month: ~$15-30
- 10,000 queries/month: ~$150-300

### Hosting Costs

- **Vercel:** Free (with limits)
- **Railway:** $5/month
- **Heroku:** $7/month
- **DigitalOcean:** $6-12/month
- **AWS:** $10-20/month (t3.micro)

## Security Checklist

- [ ] Use HTTPS (SSL certificate)
- [ ] Keep OPENAI_API_KEY secret
- [ ] Implement rate limiting
- [ ] Setup CORS properly
- [ ] Use environment variables (never commit .env)
- [ ] Regular security updates (`npm audit`)
- [ ] Monitor logs for suspicious activity

## Troubleshooting

### Server won't start
```bash
# Check logs
pm2 logs logan-ai

# Check environment variables
printenv | grep OPENAI

# Restart
pm2 restart logan-ai
```

### Embeddings taking too long
- Pre-generate embeddings locally
- Upload `embeddings.json` to server
- Skip regeneration

### Out of memory
- Increase server RAM
- Or split embeddings into batches

### API errors
- Check OpenAI API key validity
- Check API usage limits
- Monitor OpenAI status page

## Next Steps

After deployment:
1. Test all endpoints
2. Setup monitoring
3. Share link with members
4. See [INTEGRATION.md](INTEGRATION.md) for Whop integration

---

**Need help?** Check the main [README.md](../README.md) or server logs.
