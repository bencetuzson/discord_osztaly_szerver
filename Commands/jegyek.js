const Discord = require('discord.js');
delete require.cache[require.resolve("../../database/timetable.json")];

module.exports = {
    name: 'jegyek',
    description: 'writes out the link for the grades',
    admin : false,
    roles : [],
    guilds : [],
    execute: function (interaction, args, bot) {
        const Embed = new Discord.MessageEmbed()
            .setTitle("Ide kattintva tudod megnézni az értékeléseid")
            .setDescription("**Felhasználónév:** *a telves neved*\n**Alapértelmezett jelszó:** *OM azonosítód*\nNe felejtsd el átálllítani __Tanuló__ra!")
            .setURL("http://online-ertekeles.hu/gyhgimi")
            .setColor('RANDOM');
        bot.api.interactions(interaction.id, interaction.token).callback.post({data: {type: 4, data: {
            embeds: [Embed]
        }}});
    }
}
