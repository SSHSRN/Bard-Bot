const axios = require('axios');
const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_API_KEY);

const prefix = process.env.REQ_BODY_CONTENT_PREFIX;
const suffix = process.env.REQ_BODY_CONTENT_SUFFIX;

bot.start((ctx) => ctx.reply(`Welcome ${ctx.chat.first_name}\n\nI am a bot designed by Srihari S with the functionalities of Bard AI by Google.`));

bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.on('text', async (ctx) => {
    console.log(encodeURI(ctx.message.text));
    const payload = prefix + encodeURI(ctx.message.text) + suffix;
    console.log("payload: ", payload);
    const response = await axios.post(process.env.BARD_API_ENDPOINT, payload, {
        headers: {
            'accept': '*/*',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
            'content-length': payload.length,
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'cookie': process.env.BARD_COOKIE,
            'origin': 'https://bard.google.com',
            'referer': 'https://bard.google.com/'
        }
    })
    .then((response) => {
        console.log("response is: ",response.data);
        // check if the response is of type undefined
        console.log("Formatted response: " +response.data.split(`[["wrb.fr",null,"[[`)[1].split(`"]`)[0]);
        console.log("Formatted response new: " +response.data.split(`[["wrb.fr",null,"[[\\"`)[1].split(`"]`)[0].replace(/\\n/g, '\n').replace(/\\/g, ''));
        let responseMsg = response.data.split(`[["wrb.fr",null,"[[\\"`)[1].split(`"]`)[0].replace(/\\n/g, '\n').replace(/\\/g, '');
        const maxMsgLen = 4000;
        const messages = [];
        for (let i = 0; i < responseMsg.length; i += maxMsgLen) {
            messages.push(responseMsg.substring(i, i + maxMsgLen));
        }
        messages.forEach((message) => {
            ctx.reply(message);
        });
    })
    .catch((error) => {
        console.log("error: ", error);
    });
});

// Launch the bot
bot.launch();