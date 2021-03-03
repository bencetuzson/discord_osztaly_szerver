const Discord = require('discord.js');

module.exports = {
    name: 'bejonni',
    description: 'writes out the next x times when the author has to come to school',
    admin : false,
    roles : [],
    guilds : [],
    execute: function (message, args, users, timetable) {
        console.log(parseInt(args[1]));
        if (args[1] > 100 || args[1] < 1 || args.length !== 2) {
            message.channel.send("Érvénytelen paraméter!");
            return;
        }

        let id;
        let groups;
        for (user of users.USERS) {
            if (user.USER_ID === message.author.id) {
                id = user.USER_ID;
                groups = user.SUBJECTS.GROUPS;
                break;
            }
        }

        let count = 0;
        let date = new Date();
        const week = timetable.WEEK.QUARANTINE.IN_SCHOOL;
        let day;
        let dates = "";
        
        while (args[1] > count) {
            day = whichDay();
            if (day) {
                dates += `${date.getFullYear()}. ${date.getMonth()+1 < 10 ? "0" : ""}${date.getMonth()+1}. ${date.getDate() < 10 ? "0" : ""}${date.getDate()}. ${date.getDay() === 2 ? "Kedd" : "Péntek"}\n`
            }
            date.setDate(date.getDate()+1);
        }

        const Embed = new Discord.MessageEmbed()
        .setTitle(`A következő ${args[1]} alkalom, mikor be kell menned (${groups === 1 ? "sárgák" : "lilák"})`)
        .setDescription(dates)
        .setColor('RANDOM');
        message.channel.send(Embed);

        function getWeekNumber(d) {
            d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
            d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
            var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        }

        function whichDay() {
            if ((getWeekNumber(date) + week) % 4 <= 1) {
                if (date.getDay() === 2) {
                    if (groups === 1) {
                        count++
                        return date;
                    }
                } else if (date.getDay() === 5) {
                    if (groups === 2) {
                        count++
                        return date;
                    }
                }
            } else {
                if (date.getDay() === 5) {
                    if (groups === 1) {
                        count++
                        return date;
                    }
                } else if (date.getDay() === 2) {
                    if (groups === 2) {
                        count++
                        return date;
                    }
                }
            }
        }
    }
    
}