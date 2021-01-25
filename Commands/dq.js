const Discord = require('discord.js');

module.exports = {
    name: 'dq',
    description: 'generates a random team and letter',
    admin : false,
    roles : [],
    guilds : [],
    execute(message, args, database, users){
        let teams;
        let Embed;
        switch (args[1]) {
            case "db":
                teams = database.DQ;
                const randomElement = teams[Math.floor(Math.random() * teams.length)];
                Embed = new Discord.MessageEmbed()
                    .setTitle('A random asztal és betű nem más, mint...')
                    .addField(`${randomElement.NAME}`, `*${randomLetter(randomElement.PEOPLE)}*`)
                    .setColor('RANDOM');
                message.channel.send(Embed);
                break;
            default:
                teams = users.TEAMS;
                const index = Math.floor(Math.random() * teams.length);
                const randomID = teams[index]
                const randomRole = message.guild.roles.cache.get(randomID);
                let count = 0;
                for (let i = 0; i < users.USERS.length; i++) {
                    if (users.USERS[i].SUBJECTS.TEAM === index) ++count;
                }
                //console.log("index: " + index + "\nsize: " + count);
                Embed = new Discord.MessageEmbed()
                    .setTitle('A random asztal és betű nem más, mint...')
                    .addField(`${randomRole.name}`, `*${randomLetter(count)}*`)
                    .setColor('RANDOM');
                message.channel.send(Embed);
                break;
        }

        function randomLetter(max) {
            return numToLetter(Math.floor(Math.random() * max))
        }

        function numToLetter(num) {
            return String.fromCharCode(65 + num);
        }
    }
}