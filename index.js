const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const http = require('http');

// إنشاء خادم لجعل البوت "يقظاً" دائماً
http.createServer((req, res) => { res.end('Bot is alive!'); }).listen(10000);

// "منبه" داخلي يوقظ البوت كل 5 دقائق
setInterval(() => {
  http.get('http://localhost:10000', (res) => {
    console.log('كاناو تتأكد أنها يقظة...');
  });
}, 300000); 

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.includes('كاناو')) return;
  
  message.channel.sendTyping();
  
  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "google/gemini-flash-1.5-flash",
      messages: [
        { role: "system", content: "أنتِ كاناو، صديقة ذكية. أجيبي بالعربية فقط. لا تذكري أبداً أنك ذكاء اصطناعي. لا تستخدمي الإنجليزية أبداً." },
        { role: "user", content: message.content }
      ]
    }, { 
      headers: { 
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://render.com',
        'X-Title': 'Kanaw-Bot'
      } 
    });
    
    message.reply(response.data.choices[0].message.content);
  } catch (error) {
    console.error('تفاصيل الخطأ:', error.response ? error.response.data : error.message);
    message.reply('كاناو هنا.. ولكن حدث خطأ في الاتصال، تأكدي من الـ API Key في إعدادات Render.');
  }
});

client.login(process.env.DISCORD_TOKEN);

