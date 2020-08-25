const Discord = require('discord.js');

module.exports = {
    name: 'hello',
    description: 'hello user',
    execute(message, args){
        message.reply('Hi!')
    }
}