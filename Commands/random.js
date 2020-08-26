const Discord = require('discord.js');
const database = require('../database/database.json');

module.exports = {
    name: 'random',
    description: 'picks a random class member',
    execute(message, args){
        var class_members = database.CLASS_MEMBERS;
        const randomElement = class_members[Math.floor(Math.random() * class_members.length)];
        const randomColour = Math.floor(Math.random() * 0xffffff+1);
        const Embed = new Discord.MessageEmbed()
        .setTitle('A random osztálytárs nem más, mint...')
        .setDescription(`${randomElement}`)
        .setColor(randomColour);
        message.channel.send(Embed);
    }
}