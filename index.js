const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const http = require('http');

// سيرفر وهمي ليبقى البوت مستيقظاً على Render
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
  console.log('البوت ذكي ويعمل الآن!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.includes('كاناو')) return;

  // إظهار حالة الكتابة لتكون أكثر واقعية
  message.channel.sendTyping();

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "meta-llama/llama-3-8b-instruct",
      messages: [
        { 
          role: "system", 
          content: "أنتِ الآن شخصية اسمها 'كاناو'. صديقة ذكية، لطيفة، ومرحة. تتحدثين العربية الفصحى أو اللهجة البيضاء بطلاقة. لا تذكري أبداً أنكِ ذكاء اصطناعي أو نموذج Llama. إذا سألك أحد من أنتِ، فأنتِ 'كاناو' صديقة المستخدم." 
        },
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
    message.reply('عذراً، أنا هنا ولكن حدث خطأ بسيط.. هل يمكنكِ تكرار سؤالك؟');
  }
});

client.login(process.env.DISCORD_TOKEN);

