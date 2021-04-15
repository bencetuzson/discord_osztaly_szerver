const Discord = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'writes out the commands',
    admin : true,
    roles : [],
    guilds : [],
    execute(message, args, bot){
        const Embed = new Discord.MessageEmbed()
            .setTitle("Ping")
            .addFields(
                {name: "BOT", value: Date.now() - message.createdTimestamp + " ms"},
                {name: "API", value: bot.ws.ping + " ms"}
            )
            .setColor('RANDOM');
        message.channel.send(Embed);
    }
}
