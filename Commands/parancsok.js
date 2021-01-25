const Discord = require('discord.js');

module.exports = {
    name: 'parancsok',
    description: 'writes out the commands',
    admin : false,
    roles : [],
    guilds : [],
    execute(message, args, users, commands, prefix) {
        console.log("TEST");
        let Embed;
        switch (args.length) {
            case 1:
                Embed = new Discord.MessageEmbed()
                    .setTitle('A parancsok, amiket tudsz használni')
                    .setDescription("`[]` = általad meghatározott érték. Ezt a paraméterek megadásakor NE írd be!")
                    .setColor('RANDOM')
                    .setTimestamp();
                for (let i = 0; i < commands.MAIN.length; i++) {
                    replace(i)
                }
                message.channel.send(Embed);
                break;
            case 2:
                Embed = new Discord.MessageEmbed()
                    .setTitle(`\`${args[1]}\` parancs leírása:`)
                    .setDescription("`[]` = általad meghatározott érték. Ezt a paraméterek megadásakor NE írd be!")
                    .setColor('RANDOM')
                    .setTimestamp();

                for (let i = 0; i < commands.MAIN.length; i++) {
                    if (args[1] === commands.MAIN[i].name.split(" ")[0] && commands.MAIN[i].command) {
                        replace(i);
                    }
                }
                message.channel.send(Embed);
                break;
        }

        function idByNickname(name) {
            for (const raw of users.USERS) {
                if (name === raw.NICKNAME) {
                    return raw.USER_ID;
                }
            }
        }

        function replace(i) {
            console.log(commands.MAIN[i].name);
            switch (commands.MAIN[i].name) {
                case "szulinap [név vagy tag]":
                    console.log(commands.MAIN[i].value);
                    valueReplace(1, message.guild.members.cache.get(idByNickname("Tuzsi")).nickname + "`");
                    console.log(commands.MAIN[i].value);
                    break;
            }
            Embed.addField((commands.MAIN[i].command ? `**\`${prefix + commands.MAIN[i].name}\`**` : commands.MAIN[i].name), commands.MAIN[i].value);
            function valueReplace(from, to) {
                commands.MAIN[i].value = commands.MAIN[i].value.replace(`{replace${from}}`, to);
            }
        }
    }
}