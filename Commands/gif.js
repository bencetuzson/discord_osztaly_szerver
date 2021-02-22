const Discord = require('discord.js');

module.exports = {
    name: 'gif',
    description: 'picks',
    async execute(message, args, setup) {
        if (args.length !== 2) return;
        message.channel.send({files: [`../src/gif/${args[1]}.gif`]});
    }
}