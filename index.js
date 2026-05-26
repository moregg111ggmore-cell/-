const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const http = require('http');

http.createServer((req, res) => { res.end('Bot is alive!'); }).listen(10000);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.includes('كاناو')) return;
  message.channel.sendTyping();
  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "google/gemini-flash-1.5-flash",
      messages: [
        { role: "system", content: "أنتِ كاناو، صديقة ذكية. أجيبي بالعربية فقط. لا تذكري أنك ذكاء اصطناعي. لا تستخدمي الإنجليزية أبداً." },
        { role: "user", content: message.content }
      ]
    }, { headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}` } });
    message.reply(response.data.choices[0].message.content);
  } catch (error) {
    message.reply('كاناو هنا.. جربي مجدداً!');
  }
});

client.login(process.env.DISCORD_TOKEN);

