const { Client, GatewayIntentBits } = require('discord.js');
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
  console.log('البوت يعمل الآن!');
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  if (message.content.includes('كاناو')) {
    message.reply('أهلاً! أنا هنا ومستعدة للمساعدة.');
  }
});

client.login(process.env.DISCORD_TOKEN);

