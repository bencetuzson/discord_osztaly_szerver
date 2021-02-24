const Discord = require('discord.js');

module.exports = {
    name: 'parancsokOld',
    description: 'writes out the commands',
    admin : false,
    roles : [],
    guilds : [],
    execute(message, args, users, commands, prefix, bot) {
        let Embed = new Discord.MessageEmbed()
            .setDescription(`\`[]\` = általad meghatározott érték. Ezt a paraméterek megadásakor NE írd be!\nA \`${prefix}\` csak akkor kell a parancs elé, ha a szerverbe írod, DM-nél enélkül kell!`)
            .setColor('RANDOM')
            .setTimestamp();
        switch (args.length) {
            case 1:
                Embed
                    .setTitle('A parancsok, amiket tudsz használni')
                for (let i = 0; i < commands.MAIN.length; i++) {
                    replace(i)
                }
                message.channel.send(Embed);
                break;
            case 2:
                Embed
                    .setTitle(`\`${args[1]}\` parancs leírása:`)
                for (let i = 0; i < commands.MAIN.length; i++) {
                    if (args[1] === commands.MAIN[i].name.split(" ")[0] && commands.MAIN[i].command) {
                        replace(i);
                    }
                }
                message.channel.send(Embed);
                break;
            case 4:
                if (args[1] === "edit") {
                    Embed
                        .setTitle('A parancsok, amiket tudsz használni')
                    for (let i = 0; i < commands.MAIN.length; i++) {
                        replace(i)
                    }
                    bot.channels.fetch(args[2]).then(ch => ch.messages.fetch(args[3]).then(msg => {msg.edit(Embed).then(() => message.channel.send("done"));}));
                } else {
                    message.channel.send("Érvénytelen paraméter!")
                }
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
                case "szulinap [név vagy tag]": case "msg [név vagy tag] [üzenet]":
                    console.log(commands.MAIN[i].value);
                    valueReplace(1, message.guild.members.cache.get(idByNickname("Tuzsi")).nickname);
                    console.log(commands.MAIN[i].value);
                    break;
            }
            Embed.addField((commands.MAIN[i].command ? `**\`${(commands.MAIN[i].prefix ? prefix : "") + commands.MAIN[i].name}\`**` : commands.MAIN[i].name), commands.MAIN[i].value);
            function valueReplace(from, to) {
                commands.MAIN[i].value = commands.MAIN[i].value.replace(`{replace${from}}`, to);
            }
        }
    }
}