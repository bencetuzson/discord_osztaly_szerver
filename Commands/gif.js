const Discord = require('discord.js');

module.exports = {
    name: 'gif',
    description: 'picks a gif',
    async execute(interaction, args, bot) {
        bot.channels.cache.get(interaction.channel_id).send({files: [`../src/gif/${args[0].value}.gif`]});
    }
}