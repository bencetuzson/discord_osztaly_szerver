const Discord = require('discord.js');
delete require.cache[require.resolve("../../database/timetable.json")];

module.exports = {
    name: 'link',
    description: 'writes out the link of the requested lesson\'s Classroom',
    admin : false,
    roles : [],
    guilds : [],
    execute: function (interaction, args, users, timetable, bot, type) {
        let link;
        let subject;
        let db;
        const subjecr_arr = args[0].value.split(" ");
        switch (type) {
            case "classroom":
                db = timetable.CLASSROOM;
                type = "Classroom";
                break;
            case "meet":
                db = timetable.MEET;
                type = "Meet";
                break;
            default:return;
        }
        Object.keys(db).reduce((acc, key) => {
            acc[key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")] = db[key];
            if (key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === subjecr_arr[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) {
                subject = key;
                link = db[key];
            }
            return acc;
        });
        if (typeof link === 'object') {
            switch (subjecr_arr[subjecr_arr.length - 1]) {
                case "fiúk":
                    link = link.BOYS;
                    subject += " (fiúk)";
                    break;
                case "lányok":
                    link = link.GIRLS;
                    subject += " (lányok)";
                    break;
                case "sárgák":
                    link = link.G1;
                    subject += " (sárgák)";
                    break;
                case "lilák":
                    link = link.G2;
                    subject += " (lilák)";
                    break;
                case "közös":
                    link = link.MAIN;
                    subject += " (közös)";
                    break;
            }
        }
        bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
            content: `${subject} ${type} linkje: ${link}`
        }}});
    }
}