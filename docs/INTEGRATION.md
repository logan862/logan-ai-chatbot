# Integration Guide 🔌

How to integrate Logan's AI Chatbot with other platforms.

## Whop Platform Integration

### Option 1: Embedded iFrame

Embed the chatbot directly in your Whop community:

```html
<iframe 
  src="https://logan-ai.yourdomain.com" 
  width="100%" 
  height="600px" 
  frameborder="0"
  style="border-radius: 10px;"
></iframe>
```

**Setup:**
1. Go to Whop admin panel
2. Navigate to Community → Custom Pages
3. Create new page "AI Assistant"
4. Add iframe code above
5. Publish

### Option 2: Direct Link

Simply add a button/link in Whop:

```markdown
[💬 Ask Logan AI](https://logan-ai.yourdomain.com)
```

**Best placement:**
- Welcome message
- Community sidebar
- Resources section
- Course modules

### Option 3: Whop API Integration

For advanced integration, use Whop's API to authenticate members:

```javascript
// middleware/whop-auth.js
const axios = require('axios');

async function verifyWhopMember(req, res, next) {
  const token = req.headers.authorization;
  
  try {
    const response = await axios.get('https://api.whop.com/v1/me', {
      headers: { Authorization: token }
    });
    
    req.user = response.data;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// In server.js
app.post('/api/chat', verifyWhopMember, async (req, res) => {
  // Only authenticated Whop members can use chatbot
  // ...
});
```

## Discord Bot Integration

Create a Discord bot that uses the chatbot API:

### Setup

1. **Create Discord bot:**
   - Go to https://discord.com/developers/applications
   - Create new application
   - Add bot
   - Copy bot token

2. **Install Discord.js:**
   ```bash
   npm install discord.js
   ```

3. **Create bot file** (`discord-bot.js`):

```javascript
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const CHATBOT_API = process.env.CHATBOT_API_URL || 'http://localhost:3000';

client.on('ready', () => {
  console.log(`✓ Discord bot logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;
  
  // Only respond to mentions or DMs
  if (!message.mentions.has(client.user) && message.guild) return;
  
  // Get question (remove mention)
  const question = message.content.replace(/<@!?\d+>/g, '').trim();
  if (!question) return;
  
  try {
    // Show typing indicator
    await message.channel.sendTyping();
    
    // Get response from chatbot API
    const response = await axios.post(`${CHATBOT_API}/api/chat`, {
      message: question
    });
    
    // Format response
    let reply = response.data.answer;
    
    // Add sources
    if (response.data.sources.length > 0) {
      reply += '\n\n**Sources:**\n';
      response.data.sources.slice(0, 3).forEach(source => {
        reply += `• [${source.title}](${source.url})\n`;
      });
    }
    
    // Send reply (split if too long)
    if (reply.length > 2000) {
      const chunks = reply.match(/[\s\S]{1,2000}/g);
      for (const chunk of chunks) {
        await message.reply(chunk);
      }
    } else {
      await message.reply(reply);
    }
    
  } catch (error) {
    console.error('Error:', error);
    await message.reply('Sorry, I encountered an error. Please try again.');
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
```

4. **Run the bot:**
   ```bash
   DISCORD_BOT_TOKEN=your_token CHATBOT_API_URL=https://your-api.com node discord-bot.js
   ```

5. **Invite to server:**
   - Go to Discord Developer Portal
   - OAuth2 → URL Generator
   - Select: `bot`, `Send Messages`, `Read Messages`
   - Copy invite link and add to server

### Usage in Discord

```
@LoganAI How do I find viral products?
```

Bot responds with answer + sources.

## Slack Integration

Similar to Discord, using Slack Bolt:

```bash
npm install @slack/bolt
```

```javascript
const { App } = require('@slack/bolt');
const axios = require('axios');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.message(async ({ message, say }) => {
  if (message.text && message.text.includes('?')) {
    const response = await axios.post('https://your-api.com/api/chat', {
      message: message.text
    });
    
    await say({
      text: response.data.answer,
      thread_ts: message.ts
    });
  }
});

await app.start(process.env.PORT || 3001);
```

## Telegram Bot Integration

Using node-telegram-bot-api:

```bash
npm install node-telegram-bot-api
```

```javascript
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const question = msg.text;
  
  if (!question || question.startsWith('/')) return;
  
  try {
    // Send typing action
    await bot.sendChatAction(chatId, 'typing');
    
    // Get response
    const response = await axios.post('https://your-api.com/api/chat', {
      message: question
    });
    
    let reply = response.data.answer;
    
    // Add sources
    if (response.data.sources.length > 0) {
      reply += '\n\n📚 Sources:\n';
      response.data.sources.forEach(source => {
        reply += `• [${source.title}](${source.url})\n`;
      });
    }
    
    await bot.sendMessage(chatId, reply, { parse_mode: 'Markdown' });
    
  } catch (error) {
    await bot.sendMessage(chatId, 'Sorry, I encountered an error.');
  }
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    '👋 Hey! Ask me anything about TikTok Shop strategies!'
  );
});
```

## WhatsApp Integration

Using Twilio:

1. **Setup Twilio account** and WhatsApp sandbox
2. **Configure webhook:**
   ```javascript
   const twilio = require('twilio');
   
   app.post('/whatsapp/webhook', async (req, res) => {
     const { Body, From } = req.body;
     
     const response = await axios.post('https://your-api.com/api/chat', {
       message: Body
     });
     
     const twiml = new twilio.twiml.MessagingResponse();
     twiml.message(response.data.answer);
     
     res.type('text/xml').send(twiml.toString());
   });
   ```

## Custom Website Embed

### As a Chat Widget

Add to any website:

```html
<!-- Add at bottom of page -->
<div id="logan-ai-chat"></div>
<script src="https://your-domain.com/widget.js"></script>
<script>
  LoganAI.init({
    apiUrl: 'https://your-domain.com',
    position: 'bottom-right',
    theme: 'purple'
  });
</script>
```

Create `widget.js`:

```javascript
(function() {
  const LoganAI = {
    init: function(config) {
      // Create chat bubble
      const bubble = document.createElement('div');
      bubble.id = 'logan-ai-bubble';
      bubble.innerHTML = '💬';
      bubble.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        color: white;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 9999;
      `;
      
      // Create chat window
      const chatWindow = document.createElement('iframe');
      chatWindow.src = config.apiUrl;
      chatWindow.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 400px;
        height: 600px;
        border: none;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        display: none;
        z-index: 9999;
      `;
      
      // Toggle chat
      bubble.onclick = function() {
        chatWindow.style.display = 
          chatWindow.style.display === 'none' ? 'block' : 'none';
      };
      
      document.body.appendChild(bubble);
      document.body.appendChild(chatWindow);
    }
  };
  
  window.LoganAI = LoganAI;
})();
```

## API Client Libraries

### JavaScript/Node.js

```javascript
class LoganAIClient {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }
  
  async ask(question) {
    const response = await fetch(`${this.apiUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: question })
    });
    return response.json();
  }
  
  async search(query, limit = 5) {
    const response = await fetch(`${this.apiUrl}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, limit })
    });
    return response.json();
  }
}

// Usage
const client = new LoganAIClient('https://your-domain.com');
const result = await client.ask('How do I find viral products?');
console.log(result.answer);
```

### Python

```python
import requests

class LoganAIClient:
    def __init__(self, api_url):
        self.api_url = api_url
    
    def ask(self, question):
        response = requests.post(
            f'{self.api_url}/api/chat',
            json={'message': question}
        )
        return response.json()
    
    def search(self, query, limit=5):
        response = requests.post(
            f'{self.api_url}/api/search',
            json={'query': query, 'limit': limit}
        )
        return response.json()

# Usage
client = LoganAIClient('https://your-domain.com')
result = client.ask('How do I find viral products?')
print(result['answer'])
```

## Zapier Integration

Create custom Zapier action:

1. **Trigger:** New question submitted
2. **Action:** Send to Logan AI API
3. **Result:** Post to Slack/Email/etc

## Mobile App Integration

Use the REST API directly:

```swift
// Swift (iOS)
let url = URL(string: "https://your-domain.com/api/chat")!
var request = URLRequest(url: url)
request.httpMethod = "POST"
request.addValue("application/json", forHTTPHeaderField: "Content-Type")

let body = ["message": "How do I find viral products?"]
request.httpBody = try? JSONSerialization.data(withJSONObject: body)

URLSession.shared.dataTask(with: request) { data, response, error in
    // Handle response
}.resume()
```

## Rate Limiting & Authentication

Add to protect your API:

```javascript
// middleware/auth.js
function requireAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

app.post('/api/chat', requireAuth, async (req, res) => {
  // ...
});
```

## Analytics Integration

Track usage with Google Analytics:

```javascript
// In frontend
function trackQuery(question) {
  gtag('event', 'chatbot_query', {
    'event_category': 'Chatbot',
    'event_label': question.slice(0, 50)
  });
}
```

---

**Need help with integration?** Most platforms can use the REST API directly. Check their webhook/API documentation.
