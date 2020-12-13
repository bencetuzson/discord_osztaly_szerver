const Discord = require('discord.js');

module.exports = {
    name: 'random',
    description: 'picks a random class member',
    execute(message, args, database){
        const class_members = database.CLASS_MEMBERS;
        const randomElement = class_members[Math.floor(Math.random() * class_members.length)];
        const Embed = new Discord.MessageEmbed()
        .setTitle('A random osztálytárs nem más, mint...')
        .setDescription(`${randomElement}`)
        .setColor('RANDOM');
        message.channel.send(Embed);
    }
}