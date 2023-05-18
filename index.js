const axios = require('axios');
const { Telegraf } = require('telegraf');
require('dotenv').config();
var cron = require('node-cron');

const bot = new Telegraf(process.env.TELEGRAM_BOT_API_KEY);

bot.start((ctx) => ctx.reply(`Welcome ${ctx.chat.first_name}\n\nI am a bot designed by Srihari S with the functionalities of Bard AI by Google.`));

bot.hears('hi', (ctx) => ctx.reply('Hey there'));

// Launch the bot
bot.launch();