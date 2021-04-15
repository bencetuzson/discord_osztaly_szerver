const Discord = require('discord.js');

module.exports = {
    name: 'orarend',
    description: 'shows timetable',
    admin : false,
    roles : [],
    guilds : [],
    execute(interaction, args, setup, bot){
        const path = setup.TIMETABLE_FILE_PATH;
        const splitPath = path.split("/");
        const Embed = new Discord.MessageEmbed()
        .setTitle(`${setup.CURRENT_SCHOOLYEAR} ${setup.CURRENT_CLASS} órarend`)
        .attachFiles(path)
        .setImage(`attachment://${splitPath[splitPath.length-1]}`)
        .setColor("RANDOM");
        bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
            embeds: [Embed],
            attachments: path
        }}});
    }
}
