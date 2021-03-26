const Discord = require('discord.js');
delete require.cache[require.resolve("../../database/timetable.json")];

module.exports = {
    name: 'meeten',
    description: 'writes out the link of the requested lesson\'s Classroom',
    admin : false,
    roles : [],
    guilds : [],
    execute: async function (message, args, users, timetable, database, meetIndex, userList, usr_db) {
        let rawNames = [];
        let subject;
        if (!userList) {
            console.log('test')
            let names = [];
            let ind;
            usr_db = true;
            userList = [];
            for (ind = 0; ind < users.USERS.length; ++ind) {
                if(users.USERS[ind].REAL){rawNames.push(users.USERS[ind]);}
            }
            switch (args[1]) {
                case undefined:
                    names = rawNames;
                    break;
                case "n":
                    for (ind = 0; ind < rawNames.length; ++ind) {
                        if(rawNames[ind].SUBJECTS.LANGUAGE === "G"){names.push(rawNames[ind]);}
                    }
                    subject = "német";
                    break;
                case "f":
                    for (ind = 0; ind < rawNames.length; ++ind) {
                        if(rawNames[ind].SUBJECTS.LANGUAGE === "F"){names.push(rawNames[ind]);}
                    }
                    subject = "francia";
                    break;
                case "y":
                    for (ind = 0; ind < rawNames.length; ++ind) {
                        if(rawNames[ind].SUBJECTS.GROUPS === 1){names.push(rawNames[ind]);}
                    }
                    subject = "sárga";
                    break;
                case "p":
                    for (ind = 0; ind < rawNames.length; ++ind) {
                        if(rawNames[ind].SUBJECTS.GROUPS === 2){names.push(rawNames[ind]);}
                    }
                    subject = "lila";
                    break;
                case "tesi":
                    usr_db = false;
                    switch (args[2]) {
                        case "f":
                            names = database.PE.BOYS;
                            subject = "fiú tesi";
                            break;
                        case "l":
                            names = database.PE.GIRLS;
                            subject = "lány tesi";
                            break;
                        default:
                            message.channel.send("Érvénytelen paraméter!");
                            return;
                    }
                    break;
                default:
                    message.channel.send("Érvénytelen paraméter!");
                    return;
            }
            if (usr_db) {
                userList = names.sort(function (a, b) {
                    let nameA = a.LASTNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    let nameB = b.LASTNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    let nameC = a.FIRSTNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    let nameD = b.FIRSTNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    if (nameA < nameB) { return -1; } if (nameA > nameB) { return 1; } if (nameC < nameD) { return -1; } if (nameC > nameD) { return 1; } return 0;
                })
            } else {
                userList = names.sort();
            }

        }
        const Embed = new Discord.MessageEmbed()
            .setTitle(`${usr_db ? userList[meetIndex].NICKNAME : userList[meetIndex]} van${subject ? ` ${subject} ` : " "}meet-en?`)
            .setDescription(`${meetIndex + 1}/${userList.length}`)
            .setColor(!usr_db || message.guild.roles.cache.get(userList[meetIndex].ROLE_ID).color === 0 ? 'RANDOM' : message.guild.roles.cache.get(userList[meetIndex].ROLE_ID).color);
        let msg;
        if (meetIndex === 0) {
            msg = await message.channel.send(Embed);
            msg.react("✅");
            msg.react("❌");
            console.log(msg.channel.id);
            console.log(msg.id);
        } else {
            msg = message.channel.messages.fetch(message.id).then(msg => msg.edit(Embed));
        }
        return {channel: msg.channel.id, message: msg.id, user: userList[meetIndex], names: userList, subject: subject, usr_db: usr_db}
    }
}