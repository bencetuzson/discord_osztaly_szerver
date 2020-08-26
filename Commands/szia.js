const Discord = require('discord.js');

module.exports = {
    name: 'szia',
    description: 'hello user',
    execute(message, args){
        message.reply('Szia!')
    }
}