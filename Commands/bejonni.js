const { group } = require('console');
const Discord = require('discord.js');

module.exports = {
    name: 'bejonni',
    description: 'writes out the next lesson',
    admin : false,
    roles : [],
    guilds : [],
    execute: function (message, args, users, timetable) {
        let id;
        let groups;
        for (user of users.USERS) {
            console.log(user)
            if (user.USER_ID === message.author.id) {
                id = user.USER_ID;
                groups = user.SUBJECTS.GROUPS;
                console.log("success");
                break;
            }
        }

        let count = 0;
        let date = new Date();
        const week = timetable.WEEK;
        let day;
        let dates = "";

        console.log(`${date.getFullYear()}. ${date.getMonth()+1 > 10 ? "" : 0}${date.getMonth()+1}. ${date.getDate() > 10 ? "" : 0}${date.getDate()}.`)
        
        while (args[1] > count) {
            day = whichDay();
            if (day) {
                dates += `${date.getFullYear()}. ${date.getMonth()+1 > 10 ? "" : 0}${date.getMonth()+1}. ${date.getDate() > 10 ? "" : 0}${date.getDate()}. ${date.getDay() === 2 ? "Kedd" : "Péntek"}\n`
            }
            date.setDate(date.getDate()+1);
        }

        const Embed = new Discord.MessageEmbed()
        .setTitle(`A következő ${args[1]} alkalom, mikor be kell menned (${groups === 1 ? "sárgák" : "pirosak/lilák"})`)
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
            if (getWeekNumber(date) % 2 === week) {
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