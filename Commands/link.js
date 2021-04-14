const Discord = require('discord.js');
delete require.cache[require.resolve("../../database/timetable.json")];

module.exports = {
    name: 'link',
    description: 'writes out the link of the requested lesson\'s Classroom',
    admin : false,
    roles : [],
    guilds : [],
    execute: function (interaction, args, users, timetable, bot, command) {
        let link;
        switch (args[0].name) {
            case "tantárgy":
                let subject;
                let db;
                const subjecr_arr = args[0].options[0].value.split(" ");
                switch (command) {
                    case "classroom":
                        db = timetable.CLASSROOM;
                        command = "Classroom";
                        break;
                    case "meet":
                        db = timetable.MEET;
                        command = "Meet";
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
                    content: `**${subject} ${command} linkje:** ${link}`
                }}});
                break;
            default:
                switch (command) {
                    case "classroom":
                        switch (args[0].name) {
                            case "teendő":
                                switch (args[0].options[0].value) {
                                    case "Kiosztva":
                                        link = "https://classroom.google.com/a/not-turned-in/all";
                                        break;
                                    case "Hiányzik":
                                        link = "https://classroom.google.com/a/missing/all";
                                        break;
                                    case "Kész":
                                        link = "https://classroom.google.com/a/turned-in/all"
                                        break;
                                }
                                bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
                                        content: `**Teendők ${args[0].options[0].value} linkje:** ${link}`
                                    }}});
                                break;
                        }
                        break;
                    case "meet":
                        switch (args[0].name) {
                            case "új":
                                bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
                                    content: `**Link az új meeting-hez:** https://meet.google.com/new`
                                }}});
                                break;
                        }
                        break;
                }
        }
    }
}