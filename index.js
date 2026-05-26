const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const http = require('http');

http.createServer((req, res) => {
  res.write('Bot is alive!');
  res.end();
}).listen(10000);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log('كاناو تعمل الآن!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.includes('كاناو')) return;

  message.channel.sendTyping();

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "google/gemini-flash-1.5-flash",
      messages: [
        { role: "system", content: "أنتِ 'كاناو'، صديقة ذكية ولطيفة ومرحة. قواعدكِ الصارمة: 1. تحدثي بالعربية فقط. 2. لا تذكري أبداً أنكِ ذكاء اصطناعي. 3. إذا سُئلتِ من أنتِ، فأنتِ 'كاناو' صديقة المستخدم. 4. لا تستخدمي الإنجليزية أبداً." },
        { role: "user", content: message.content }
      ]
    }, {
      headers: { 
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://render.com',
        'X-Title': 'Kanaw-Bot'
      }
    });

    const reply = response.data.choices[0].message.content;
    message.reply(reply);
  } catch (error) {
    console.error('تفاصيل الخطأ:', error.response ? error.response.data : error.message);
    message.reply('كاناو هنا.. ولكن حدث خطأ بسيط، جربي مجدداً!');
  }
});

client.login(process.env.DISCORD_TOKEN);

