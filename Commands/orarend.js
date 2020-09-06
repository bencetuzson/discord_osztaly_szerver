const Discord = require('discord.js');
const setup = require('../../database/setup.json')

module.exports = {
    name: 'orarend',
    description: 'shows timetable',
    execute(message, args){
        let currentDate = new Date();
        let year = currentDate.getFullYear();
        const randomColour = Math.floor(Math.random() * 0xffffff+1);
      const embed = new Discord.MessageEmbed()
      .setTitle(`${setup.CURRENT_SCHOOLYEAR} ${setup.CURRENT_CLASS} órarend`)
      .attachFiles(setup.TIMETABLE_PATH)
      .setImage('attachment://orarend.png')
      .setColor(randomColour);
      message.channel.send(embed);
    }
}