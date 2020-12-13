const Discord = require('discord.js');

module.exports = {
    name: 'orarend',
    description: 'shows timetable',
    execute(message, args, setup){
        const embed = new Discord.MessageEmbed()
        .setTitle(`${setup.CURRENT_SCHOOLYEAR} ${setup.CURRENT_CLASS} órarend`)
        .attachFiles(setup.ORAREND_PATH)
        .setImage('attachment://orarend.png')
        .setColor("RANDOM");
        message.channel.send(embed);
    }
}