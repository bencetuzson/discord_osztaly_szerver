const Discord = require('discord.js');

module.exports = {
    name: 'parancsok',
    description: 'writes out the commands',
    admin : false,
    roles : [],
    guilds : [],
    execute(message, args, users, commands, prefix, bot, database) {
        let value = "";
        let Embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp();
        switch (args.length) {
            case 1:
                let command_arr = [];
                Embed
                    .setTitle('A parancsok, amiket tudsz használni')
                    .setDescription(`A felső a parancs neve, az alsó pedig amit be kell írnod a leíráshoz.\nA \`${prefix}\` csak akkor kell a parancs elé, ha a szerverbe írod, DM-nél enélkül kell!`)
                for (let i = 0; i < commands.MAIN.length; i++) {
                    if (!command_arr.includes(commands.MAIN[i].name.split(' ')[0])) {
                        command_arr.push(commands.MAIN[i].name.split(' ')[0]);
                        //Embed.addField(`${prefix}${commands.MAIN[i].name.split(' ')[0]}`, `\`${prefix}parancsok ${commands.MAIN[i].name.split(' ')[0]}\``, true);
                        if (commands.MAIN[i].command) {
                            if (commands.MAIN[i].done) {
                                Embed.addField(`${commands.MAIN[i].prefix ? `_${prefix}_` : ""}**${commands.MAIN[i].name.split(' ')[0]}**`, `\`${prefix}parancsok ${commands.MAIN[i].name.split(' ')[0]}\``, true);
                            } else {
                                Embed.addField(`${commands.MAIN[i].prefix ? `_${prefix}_` : ""}**${commands.MAIN[i].name.split(' ')[0]}**`, commands.MAIN[i].value, true);
                            }
                        } else {
                            Embed.addField(commands.MAIN[i].name, commands.MAIN[i].value);
                        }
                    }
                }
                //console.log(command_arr);
                message.channel.send(Embed);
                break;
            case 2:
                Embed
                    .setTitle(`\`${args[1]}\` parancs leírása:`)
                    .setDescription(`\`[]\` = általad meghatározott érték. Ezt a paraméterek megadásakor NE írd be!\nA \`${prefix}\` csak akkor kell a parancs elé, ha a szerverbe írod, DM-nél enélkül kell!`)
                for (let i = 0; i < commands.MAIN.length; i++) {
                    if (args[1] === commands.MAIN[i].name.split(" ")[0] && commands.MAIN[i].command) {
                        replace(i);
                    }
                }
                message.channel.send(Embed);
                break;
        }

        function replace(i) {
            value = commands.MAIN[i].value;
            switch (commands.MAIN[i].name) {
                case "szulinap [név vagy tag]": case "msg [név vagy tag] [üzenet]": case "email [név vagy tag]":
                    let usrs = [];
                    for (const user of users.USERS) {
                        if (user.REAL && user.USER_ID !== "" && user.USER_ID !== null && message.guild.members.cache.get(user.USER_ID)) {
                            usrs.push(user.USER_ID);
                        }
                    }
                    let usr = message.guild.members.cache.get(usrs[random(usrs.length)]);
                    valueReplace(1, usr.nickname ? usr.nickname : usr.username);
                    valueReplace(2, users.USERS[random(users.USERS.length)].NICKNAME)
                    break;
                case "szulinap [abc vagy datum]":
                    console.log(Boolean(random(2)));
                    valueReplace(1, Boolean(random(2)) ? "abc" : "datum");
                    break;
                case "orak [év] [hónap] [nap]":
                    valueReplace(1, new Date().getFullYear());
                    valueReplace(2, new Date().getMonth() + 1);
                    valueReplace(3, new Date().getDate());
                    break;
                case "bejonni [szám]": case "laptop [szám]": case "orak [nap]":
                    valueReplace(100, Math.floor(Math.random() * 100) + 1);
                    break;
                case "csapat [csapatok száma]":
                    valueReplace(15, Math.floor(Math.random() * 15) + 1);
                    break;
                case "csapat tesi [f vagy l] [csapatok száma]":
                    valueReplace(15, Math.floor(Math.random() * database.PE[genderById(message.author.id) === "M" ? "BOYS" : "GIRLS"].length / 2) + 1);
                    valueReplace(1, genderById(message.author.id) === "M" ? "f" : "l");
                    break;
                case "szin [HEX]": case "szin test [HEX]":
                    valueReplace(1, random(0xffffff+1).toString(16));
                    valueReplace(2, random(0xffffff+1).toString(16));
                    break;
                case "szin [R] [G] [B]": case "szin test [R] [G] [B]":
                    valueReplace(1, random(256));
                    valueReplace(2, random(256));
                    valueReplace(3, random(256));
                    break;
                case "szin [szín neve]": case "szin test [szín neve]":
                    const discord_colours = ["DEFAULT", "WHITE", "AQUA", "GREEN", "BLUE", "YELLOW", "PURPLE", "LUMINOUS_VIVID_PINK", "GOLD", "ORANGE", "RED", "GREY", "DARKER_GREY", "NAVY", "DARK_AQUA", "DARK_GREEN", "DARK_BLUE", "DARK_PURPLE", "DARK_VIVID_PINK", "DARK_GOLD", "DARK_ORANGE", "DARK_RED", "DARK_GREY", "LIGHT_GREY", "DARK_NAVY", "BLURPLE", "GREYPLE", "DARK_BUT_NOT_BLACK", "NOT_QUITE_BLACK", "RANDOM"];
                    let colours = [];
                    for (const c of database.COLOURS) {
                        colours.push(c.NAME);
                    }
                    valueReplace(1, Boolean(random(2)) ? discord_colours[random(discord_colours.length)] : colours[random(colours.length)]);
                    break;
                case "nev [bn, kn vagy vn]":
                    let name;
                    switch (random(3)) {
                        case 0:
                            name = "bn";
                            break;
                        case 1:
                            name = "kn";
                            break;
                        case 2:
                            name = "vn"
                            break;
                    }
                    valueReplace(1, name);
                    break;

            }
            Embed.addField((commands.MAIN[i].command ? `**\`${(commands.MAIN[i].prefix ? prefix : "") + commands.MAIN[i].name}\`**` : commands.MAIN[i].name), value);
            function valueReplace(from, to) {
                value = value.replace(`{replace${from}}`, to);
            }

            function random(max) {
                return Math.floor(Math.random() * max);
            }
        }

        function idByNickname(name) {
            for (const raw of users.USERS) {
                if (name === raw.NICKNAME) {
                    return raw.USER_ID;
                }
            }
        }

        function genderById(id) {
            for (const raw of users.USERS) {
                if (id === raw.USER_ID) {
                    return raw.GENDER;
                }
            }
        }
    }
}