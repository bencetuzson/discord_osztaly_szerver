const Welcome = require("discord-welcome");
const Discord = require('discord.js');

module.exports = {
    name: 'welcome',
    description: 'welcome DM',
    execute(message, args){
        Welcome(bot, {
            privatemsg : "Default message, welcome anyway",
            publicmsg : null,
            publicchannel : null
        });
    }
}