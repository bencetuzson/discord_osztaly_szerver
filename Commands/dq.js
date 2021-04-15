const Discord = require('discord.js');

module.exports = {
    name: 'dq',
    description: 'generates a random team and letter',
    admin : false,
    roles : [],
    guilds : [],
    execute(interaction, args, database, users, bot){
        let teams;
        let Embed;
        teams = users.TEAMS;
        const index = Math.floor(Math.random() * teams.length);
        const randomID = teams[index].ID;
        const randomRole = bot.guilds.cache.get(interaction.guild_id).roles.cache.get(randomID);
        let count = 0;
        for (let i = 0; i < users.USERS.length; i++) {
            if (users.USERS[i].SUBJECTS.TEAM === index) ++count;
        }
        Embed = new Discord.MessageEmbed()
            .setTitle('A random asztal és betű nem más, mint...')
            .addField(`${randomRole.name}`, `*${randomLetter(count)}*`)
            .setColor('RANDOM');
        bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
            embeds: [Embed]
        }}});

        function randomLetter(max) {
            return numToLetter(Math.floor(Math.random() * max))
        }

        function numToLetter(num) {
            return String.fromCharCode(65 + num);
        }
    }
}
