const Discord = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'says ping!',
    execute(message, args){
        const Embed = new Discord.MessageEmbed()
        .setTitle('Pong!')
        .setDescription(`Pong! Executed in ${Math.round(message.client.ping*100)/100} ms!`)
        .setColor(0xe6400e);
        message.channel.send(Embed);
    }
}