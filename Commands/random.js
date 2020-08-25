const Discord = require('discord.js');

module.exports = {
    name: 'random',
    descroption: 'picks a random class member',
    execute(message, args){
        var class_members = ["Fófi", "Nelly", "Gery", "Rozi", "Encsi", "Eszti", "Benedek", "Zoé", "Andriska", "Berci", "Matyi", "Ambi", "Gandi", "Liliána", "Luca", "Frédi", "Áron", "Lilko", "Adri", "Zoli", "Soki", "Adél", "Csöcsi", "Bendi", "Tuzsi", "Marci", "Panka", "Mesi"];
        const randomElement = class_members[Math.floor(Math.random() * class_members.length)];
        const randomColour = Math.floor(Math.random() * 0xffffff+1);
        const Embed = new Discord.MessageEmbed()
        .setTitle('A random osztálytárs nem más, mint...')
        .setDescription(`${randomElement}`)
        .setColor(randomColour);
        message.channel.send(Embed);
    }
}