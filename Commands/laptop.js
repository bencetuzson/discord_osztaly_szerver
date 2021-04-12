const Discord = require('discord.js');

module.exports = {
    name: 'laptop',
    description: 'writes out the next x times when the author has to bring your laptop to school',
    admin : false,
    roles : [],
    guilds : [],
    execute: function (interaction, args, users, timetable, bot) {
        console.log(parseInt(args[0].value));
        if (args[0].value > 100 || args[0].value < 1) {
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
                content: "Érvénytelen paraméter!"
            }}});
            return;
        }

        let id;
        let groups;
        for (user of users.USERS) {
            if (user.USER_ID === interaction.member.user.id) {
                id = user.USER_ID;
                groups = user.SUBJECTS.GROUPS;
                break;
            }
        }

        let count = 0;
        let date = new Date();
        const week = timetable.WEEK.ENG_IT;
        console.log("week " + week)
        let day;
        let dates = "";
        
        while (args[0].value > count) {
            day = whichDay();
            if (day) {
                dates += `${date.getFullYear()}. ${date.getMonth()+1 < 10 ? "0" : ""}${date.getMonth()+1}. ${date.getDate() < 10 ? "0" : ""}${date.getDate()}. ${date.getDay() === 2 ? "Kedd" : "Hétfő"}\n`
            }
            date.setDate(date.getDate()+1);
        }

        const Embed = new Discord.MessageEmbed()
        .setTitle(`A következő ${args[0].value} alkalom, mikor be kell hoznod a laptopod (${groups === 1 ? "sárgák" : "pirosak/lilák"})`)
        .setDescription(dates)
        .setColor('RANDOM');
        bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
            embeds: [Embed]
        }}});

        function getWeekNumber(d) {
            d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
            d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
            var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        }

        function whichDay() {
            if (getWeekNumber(date) % 2 === week) {
                if (date.getDay() === 1) {
                    if (groups === 1) {
                        count++
                        return date;
                    }
                } else if (date.getDay() === 1) {
                    if (groups === 2) {
                        count++
                        return date;
                    }
                }
            } else {
                if (date.getDay() === 2) {
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