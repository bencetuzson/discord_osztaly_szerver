const Discord = require('discord.js');
const setup = require('../../database/setup.json')

module.exports = {
    name: 'orarend',
    description: 'shows timetable',
    execute(message, args){
        const embed = new Discord.MessageEmbed()
        .setTitle(`${setup.CURRENT_SCHOOLYEAR} ${setup.CURRENT_CLASS} órarend`)
        .attachFiles(setup.TIMETABLE_PATH)
        .setImage('attachment://orarend.png')
        .setColor("RANDOM");
        message.channel.send(embed);
    }
}