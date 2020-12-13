const Discord = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'writes out the commands',
    execute(message, args, bot){
        //message.channel.send("Pong").then(async msg => {
            const Embed = new Discord.MessageEmbed()
                .setTitle("Ping")
                .addFields(
                    {name: "BOT", value: Date.now() - message.createdTimestamp + " ms"},
                    {name: "API", value: bot.ws.ping + " ms"}
                )
                .setColor('RANDOM');
            message.channel.send(Embed);
            //await message.channel.messages.fetch({ around: msg.id, limit: 1 }).then(messages => {
            //    message.channel.bulkDelete(messages);
            //});
        //})
    }
}
