require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TOKEN;
const url = process.env.URL;
const port = 3000;

// Create express server
const app = express();

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token);
bot.setWebHook(`${url}/bot`,
  { cetificate: '/etc/letsencrypt/live/bot.leoniuk.dev/cert.pem' },
);


app.use(express.json());
app.post(`/bot`, async (req, res) => {
  const body = await req.body;
  bot.processUpdate(body);
  res.end();
})

app.listen(port, () => {
  console.log(`app started on port ${port}`);
})

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});