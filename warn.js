/*module.exports = {
    run() {*/
        const Discord = require('discord.js');
        const bot = new Discord.Client({
            partials: ['USER', 'GUILD_MEMBER', 'CHANNEL', 'MESSAGE', 'REACTION']
        });
        let setup = require('../database/setup.json');
        let token = require(setup.CONFIG_PATH).MAIN.TOKEN;

        bot.login(token);
        bot.on('ready', () => {
            bot.channels.cache.get(setup.REACTION_CHANNELS.BOT.bot_info).send("Stopped...");
            bot.destroy();
        })
//    }
//}