# 🚀 Logan AI Chatbot - Deployment Guide

## Quick Deploy to Vercel (5 minutes)

### Prerequisites
- GitHub account
- Vercel account (sign up free at vercel.com)
- OpenAI API key

---

## Step 1: Push to GitHub

```bash
cd logan-ai-bot

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Logan AI Chatbot"

# Create new GitHub repository
# Go to github.com/new and create a new repository named "logan-ai-chatbot"

# Add remote and push
git remote add origin https://github.com/YOUR-USERNAME/logan-ai-chatbot.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect your GitHub account
4. Select the `logan-ai-chatbot` repository
5. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** ./
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)

6. **Add Environment Variables:**
   ```
   OPENAI_API_KEY=sk-your-actual-api-key
   ACCESS_PASSWORD=tikshop2026
   ```

7. Click "Deploy"

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? logan-ai-chatbot
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add OPENAI_API_KEY
vercel env add ACCESS_PASSWORD

# Deploy to production
vercel --prod
```

---

## Step 3: Configure Access

### Set Custom Password

In Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Edit `ACCESS_PASSWORD`
3. Set to your desired password (share with members only)
4. Redeploy

### Default Password
- `tikshop2026` (change this!)

---

## Step 4: Share with Members

Once deployed, you'll get a URL like:
```
https://logan-ai-chatbot.vercel.app
```

### Announcement Template:

```
🚀 NEW: Logan AI Chatbot is Live!

I've created an AI version of myself to answer your TikTok Shop questions 24/7.

🔗 Link: https://logan-ai-chatbot.vercel.app
🔒 Password: [your-password-here]

This bot has been trained on:
✅ All my YouTube videos
✅ My TikTok content
✅ Coaching materials
✅ Best practices & strategies

Ask it anything about:
• Product research & sourcing
• Content strategy
• Growing your TikTok account
• Making your first sale
• Scaling to 6-figures

It'll give you detailed answers with sources from my actual content.

This is in BETA - let me know if you find any issues!
```

---

## Step 5: Optional - Custom Domain

### Add Custom Domain (e.g., ai.logancuffari.com)

1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records (Vercel will show you what to add)
4. Wait for DNS propagation (5-30 minutes)

---

## Monitoring & Costs

### Expected Costs
- **Hosting:** $0 (Vercel free tier)
- **OpenAI API:** ~$20-30/month (1000 queries)
- **Total:** $20-30/month

### Monitor Usage

**Vercel:**
- Dashboard → Your Project → Analytics
- View traffic, errors, bandwidth

**OpenAI:**
- platform.openai.com/usage
- Check API costs daily

### Cost Optimization
- Embeddings are cached (no repeated costs)
- Only chat queries use API credits
- Set usage alerts in OpenAI dashboard

---

## Troubleshooting

### "Invalid password" error
- Check ACCESS_PASSWORD in Vercel environment variables
- Make sure it matches what you're entering
- Clear browser localStorage and try again

### "Failed to initialize" error
- Verify OPENAI_API_KEY is set correctly
- Check OpenAI API key has sufficient credits
- Check Vercel function logs for errors

### Slow responses
- First request may take 10-15 seconds (cold start)
- Subsequent requests faster (~3-5 seconds)
- Normal for serverless functions

### Embeddings not found
- Vercel will create them on first request
- Takes ~30 seconds on first deployment
- Check function logs for progress

---

## Updating the Bot

### Update Content
```bash
# Make changes to knowledge base
# Rebuild embeddings
npm run build-kb

# Commit and push
git add .
git commit -m "Update knowledge base"
git push

# Vercel auto-deploys on push
```

### Update Code
```bash
# Make code changes
git add .
git commit -m "Description of changes"
git push

# Auto-deploys to production
```

---

## Security Best Practices

✅ **DO:**
- Change default password immediately
- Use strong, unique password for ACCESS_PASSWORD
- Share password only with paid members
- Monitor usage regularly
- Set OpenAI spending limits

❌ **DON'T:**
- Commit `.env` file to GitHub
- Share OPENAI_API_KEY publicly
- Use weak passwords
- Forget to monitor costs

---

## Support

### If Something Breaks:
1. Check Vercel function logs
2. Check OpenAI API status (status.openai.com)
3. Test locally: `npm start`
4. Redeploy if needed: `vercel --prod`

### Rollback to Previous Version:
1. Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → Promote to Production

---

## Next Steps (Optional)

### Future Enhancements:
- [ ] Whop OAuth integration
- [ ] Discord bot version
- [ ] Usage analytics dashboard
- [ ] Member feedback collection
- [ ] A/B test different prompts
- [ ] Add conversation history
- [ ] Rate limiting per user

### Advanced Security:
- [ ] JWT-based authentication
- [ ] IP whitelist
- [ ] Per-member access codes
- [ ] Session management

---

## Success Metrics

### You'll know it's working when:
✅ Members can access the chatbot
✅ Bot responds with relevant answers
✅ Sources are cited correctly
✅ No authentication errors
✅ Costs stay under $30/month
✅ Members stop asking basic questions

---

## Contact

Questions? Check the logs first, then reach out to the developer.

**Live URL:** https://logan-ai-chatbot.vercel.app
**GitHub:** https://github.com/YOUR-USERNAME/logan-ai-chatbot

---

🎉 **You're Live!** Share with your members and watch them get instant answers 24/7.
