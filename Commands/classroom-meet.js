const Discord = require('discord.js');
delete require.cache[require.resolve("../../database/timetable.json")];

module.exports = {
    name: 'classroom-meet',
    description: 'writes out the link of the requested lesson\'s Google Classroom or Google Meet link',
    admin : false,
    roles : [],
    guilds : [],
    execute: function (interaction, args, users, timetable, bot, command) {
        let link;
        let user;
        switch (args[0].name) {
            case "tantárgy":
                let subject;
                let db;
                const subjecr_arr = args[0].options[0].value.split(" ");
                switch (command) {
                    case "classroom":
                        db = timetable.CLASSROOM;
                        user = args[0].options[1] ? `/u/${args[0].options[1].value}/c/` : "/c/";
                        break;
                    case "meet":
                        db = timetable.MEET;
                        user = args[0].options[1] ? `?authuser=${args[0].options[1].value}` : "";
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
                switch (command) {
                    case "classroom":
                        link = link.replace("/c/", user)
                        break;
                    case "meet":
                        link = `${link}${user}`
                        break;
                    default:return;
                }
                bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
                    content: `**${subject} ${command.charAt(0).toUpperCase() + command.slice(1)} linkje:** ${link}`
                }}});
                break;
            default:
                switch (command) {
                    case "classroom":
                        switch (args[0].name) {
                            case "teendő":
                                user = args[0].options[1] ? `/u/${args[0].options[1].value}/` : "/";
                                switch (args[0].options[0].value) {
                                    case "Kiosztva":
                                        link = `https://classroom.google.com${user}a/not-turned-in/all`;
                                        break;
                                    case "Hiányzik":
                                        link = `https://classroom.google.com${user}a/missing/all`;
                                        break;
                                    case "Kész":
                                        link = `https://classroom.google.com${user}a/turned-in/all`;
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
                                user = args[0].options[0] ? `?authuser=${args[0].options[0].value}` : "";
                                bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
                                    content: `**Link az új meeting-hez:** https://meet.google.com/new${user}`
                                }}});
                                break;
                        }
                        break;
                }
        }
    }
}
