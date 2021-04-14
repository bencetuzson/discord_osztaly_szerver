const Discord = require('discord.js');

module.exports = {
    name: 'parancsok',
    description: 'writes out the commands',
    admin : false,
    roles : [],
    guilds : [],
    execute(interaction, args, users, commands, prefix, bot, database, timetable) {
        let value = "";
        let blank = 0;
        let rand;
        let Embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTimestamp();
        const subjects = ["Angol közös", "Angol sárgák", "Angol lilák", "Biosz", "Fizika", "Föci", "Francia", "Info sárgák", "Info lilák", "Kémia", "Kommunikáció", "Matek", "Német", "Osztályidő", "Tesi fiúk", "Tesi lányok", "Töri"];
        const team_opts = ["sárgák", "lilák", "német", "francia", "tesi fiúk", "tesi lányok"]
        if (args) {
            switch (args.length) {
                case 1:
                    Embed
                        .setTitle(`\`${args[0].value}\` parancs leírása:`)
                        .setDescription(`\`[]\`, \`()\` = általad meghatározott érték. Ezeket a paraméterekkel NE írd be!\nHa a szerverbe írod, akkor kell a parancs elé egy \`/\` is, de DM-nél enélkül kell!\n\`[]\` = kötelező, \`()\` = nem kötelező`)
                    for (let i = 0; i < commands.MAIN.length; i++) {
                        if (args[0].value === commands.MAIN[i].name.split(" ")[0] && commands.MAIN[i].command) {
                            replace(i);
                        }
                    }
                    bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                        type: 4,
                        data: { embeds: [Embed]
                    }}});
                    break;
            }
        } else {
            let command_arr = [];
            Embed
                .setTitle('A parancsok, amiket tudsz használni')
                .setDescription(`A felső a parancs neve, az alsó pedig amit be kell írnod a leíráshoz.\nHa a szerverbe írod, akkor kell a parancs elé egy \`/\` is, de DM-nél enélkül kell!`)
            for (let i = 0; i < commands.MAIN.length; i++) {
                if (commands.MAIN[i].display && !command_arr.includes(commands.MAIN[i].name.split(' ')[0])) {
                    command_arr.push(commands.MAIN[i].name.split(' ')[0]);
                    //Embed.addField(`${prefix}${commands.MAIN[i].name.split(' ')[0]}`, `\`${prefix}parancsok ${commands.MAIN[i].name.split(' ')[0]}\``, true);
                    if (commands.MAIN[i].command) {
                        if (commands.MAIN[i].done) {
                            blank++
                            Embed.addField(`**${commands.MAIN[i].name.split(' ')[0]}**`, `\`/parancsok ${commands.MAIN[i].name.split(' ')[0]}\``, true);
                        } else {
                            Embed.addField(`**${commands.MAIN[i].name.split(' ')[0]}**`, commands.MAIN[i].value, true);
                        }
                    } else {
                        if ((blank - 2) % 3 === 0) Embed.addField('\u200B', '\u200B', true);
                        blank = 0;
                        Embed.addField(commands.MAIN[i].name, commands.MAIN[i].value);
                    }
                }
            }
            //console.log(command_arr);
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: { embeds: [Embed]
            }}});
        }

        function replace(i) {
            value = commands.MAIN[i].value;
            const wd = ["hétfő", "kedd", "szerda", "csütörtök", "péntek"]
            let usrs = [];
            let usr;
            switch (commands.MAIN[i].name) {
                case "msg [név vagy tag] [üzenet]":
                    for (const user of users.USERS) {
                        if (user.REAL && user.USER_ID !== "" && user.USER_ID !== null && bot.guilds.cache.get(interaction.guild_id).members.cache.get(user.USER_ID)) {
                            usrs.push(user.USER_ID);
                        }
                    }
                    usr = bot.guilds.cache.get(interaction.guild_id).members.cache.get(usrs[random(usrs.length)]);
                    valueReplace(1, usr.nickname ? usr.nickname : usr.username);
                    valueReplace(2, users.USERS[random(users.USERS.length)].NICKNAME)
                    break;
                case "szulinap név fiú [név]": case "email név fiú [név]":
                    for (const user of users.USERS) {
                        if (user.REAL && user.USER_ID !== "" && user.USER_ID !== null && user.GENDER === "M" && bot.guilds.cache.get(interaction.guild_id).members.cache.get(user.USER_ID)) {
                            usrs.push(user.NICKNAME);
                        }
                    }
                    console.log(usrs);
                    valueReplace(1, usrs[random(usrs.length)]);
                    break;
                case "szulinap név lány [név]": case "email név lány [név]":
                    for (const user of users.USERS) {
                        if (user.REAL && user.USER_ID !== "" && user.USER_ID !== null && user.GENDER === "F" && bot.guilds.cache.get(interaction.guild_id).members.cache.get(user.USER_ID)) {
                            usrs.push(user.NICKNAME);
                        }
                    }
                    valueReplace(1, usrs[random(usrs.length)]);
                    break;
                case "email név tanár [név]":
                    const teachers = ["Ági", "Ancsa", "Betti", "Chris", "Dóri", "Emese", "Fruzsi", "Gólya Orsi", "György", "Juli", "Kristóf", "Laza Orsi", "Melinda", "Vili", "Zsuzsi"]
                    valueReplace(1, teachers[random(teachers.length)]);
                    break;
                case "szulinap tag [tag]": case "email tag [tag]":
                    for (const user of users.USERS) {
                        if (user.REAL && user.USER_ID !== "" && user.USER_ID !== null && bot.guilds.cache.get(interaction.guild_id).members.cache.get(user.USER_ID)) {
                            usrs.push(user.USER_ID);
                        }
                    }
                    usr = bot.guilds.cache.get(interaction.guild_id).members.cache.get(usrs[random(usrs.length)]);
                    valueReplace(1, usr.nickname ? usr.nickname : usr.username);
                    break;
                case "szulinap lista [rendezés]":
                    console.log(Boolean(random(2)));
                    valueReplace(1, Boolean(random(2)) ? "abc" : "datum");
                    break;
                case "bejonni [szám]": case "laptop [alkalom]":
                    valueReplace(100, random(100) + 1);
                    break;
                case "orak dátum [év] [hónap] [nap]":
                    valueReplace(1, new Date().getFullYear());
                    valueReplace(2, new Date().getMonth() + 1);
                    valueReplace(3, new Date().getDate());
                    break;

                case "orak múlva [nap] (hét)":
                    valueReplace(100, random(100) + 1);
                    valueReplace(101, random(100) + 1);
                    valueReplace(102, random(100) + 1);
                    break;
                case "orak hét [nap] (hét)":
                    valueReplace(102, random(100) + 1);
                    valueReplace(100, wd[random(wd.length)]);
                    valueReplace(101, wd[random(wd.length)]);
                    break;
                case "csapat [darab] (csoport)":
                    valueReplace(15, random(12) + 1);
                    valueReplace(16, random(12) + 1);
                    valueReplace(1, team_opts[random(team_opts.length)]);
                    break;
                case "szin hex [hex] (teszt)":
                    valueReplace(1, random(0xffffff+1).toString(16));
                    valueReplace(2, random(0xffffff+1).toString(16));
                    valueReplace(3, Boolean(random(2)) ? "True" : "False");
                    valueReplace(4, Boolean(random(2)) ? "True" : "False");
                    break;
                case "szin rgb [R] [G] [B] (teszt)":
                    valueReplace(1, random(256));
                    valueReplace(2, random(256));
                    valueReplace(3, random(256));
                    valueReplace(4, Boolean(random(2)) ? "True" : "False");

                    break;
                case "szin név [név] (teszt)":
                    const discord_colours = ["DEFAULT", "WHITE", "AQUA", "GREEN", "BLUE", "YELLOW", "PURPLE", "LUMINOUS_VIVID_PINK", "GOLD", "ORANGE", "RED", "GREY", "DARKER_GREY", "NAVY", "DARK_AQUA", "DARK_GREEN", "DARK_BLUE", "DARK_PURPLE", "DARK_VIVID_PINK", "DARK_GOLD", "DARK_ORANGE", "DARK_RED", "DARK_GREY", "LIGHT_GREY", "DARK_NAVY", "BLURPLE", "GREYPLE", "DARK_BUT_NOT_BLACK", "NOT_QUITE_BLACK", "RANDOM"];
                    let colours = [];
                    for (const c of database.COLOURS) {
                        colours.push(c.NAME);
                    }
                    valueReplace(1, Boolean(random(2)) ? discord_colours[random(discord_colours.length)] : colours[random(colours.length)]);
                    valueReplace(2, Boolean(random(2)) ? "True" : "False");
                    break;
                case "nev [rendezés]":
                    let name;
                    switch (random(3)) {
                        case 0:
                            name = "becenév";
                            break;
                        case 1:
                            name = "keresztnév";
                            break;
                        case 2:
                            name = "vezetéknév"
                            break;
                    }
                    valueReplace(1, name);
                    break;
                case "classroom tantárgy [tantárgy] (user)": case "meet tantárgy [tantárgy] (user)":
                    valueReplace(1, subjects[random(subjects.length)]);
                    valueReplace(2, subjects[random(subjects.length)]);
                    valueReplace(3, random(6));
                    break;
                case "classroom teendő [típus] (user)":
                    const types = ["Kiosztva", "Hiányzik", "Kész"]
                    valueReplace(1, types[random(types.length)]);
                    valueReplace(2, types[random(types.length)]);
                    valueReplace(3, random(6));
                    break;
                case "meet új (user)": case "jon (user)": case "most (user)":
                    valueReplace(1, random(6));
                    break;
                case "meeten (csoport)": case "parok (csoport)":
                    valueReplace(1, team_opts[random(team_opts.length)])
                    break;

            }
            Embed.addField((commands.MAIN[i].command ? `**\`${commands.MAIN[i].name}\`**` : commands.MAIN[i].name), value);
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

        function groupById(id) {
            for (const raw of users.USERS) {
                if (id === raw.USER_ID) {
                    return raw.SUBJECTS.GROUPS;
                }
            }
        }
    }
}