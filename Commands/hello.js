const Discord = require('discord.js');

module.exports = {
    name: 'hello',
    descroption: 'hello user',
    execute(message, args){
        message.reply('Hi!')
    }
}