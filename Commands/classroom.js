const Discord = require('discord.js');
delete require.cache[require.resolve("../../database/timetable.json")];

module.exports = {
    name: 'classroom',
    description: 'writes out the link of the requested lesson\'s Classroom',
    admin : false,
    roles : [],
    guilds : [],
    execute: function (message, args, users, timetable) {
        let link;
        let subject;
        if (args.length < 2) return message.channel.send("Érvénytelen paraméter!");
        Object.keys(timetable.CLASSROOM).reduce((acc, key) => {
            acc[key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")] = timetable.CLASSROOM[key];
            if (key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === args[1].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) {
                subject = key;
                link = timetable.CLASSROOM[key];
            }
            return acc;
        });
        if (typeof link === 'object') {
            if (args.length > 3) return message.channel.send("Érvénytelen paraméter!");
            switch (args[2]) {
                case "f":
                    if (link.BOYS) {
                        link = link.BOYS;
                    } else {
                        return message.channel.send("Érvénytelen paraméter!");
                    }
                    subject += " (fiúk)";
                    break;
                case "l":
                    if (link.GIRLS) {
                        link = link.GIRLS;
                    } else {
                        return message.channel.send("Érvénytelen paraméter!");
                    }
                    subject += " (lányok)";
                    break;
                case "y":
                    if (link.G1) {
                        link = link.G1;
                    } else {
                        return message.channel.send("Érvénytelen paraméter!");
                    }
                    subject += " (sárgák)";
                    break;
                case "p":
                    if (link.G2) {
                        link = link.G2;
                    } else {
                        return message.channel.send("Érvénytelen paraméter!");
                    }
                    subject += " (lilák)";
                    break;
                case undefined:
                    if (link.MAIN) {
                        link = link.MAIN;
                    } else {
                        return message.channel.send("Érvénytelen paraméter!");
                    }
                    subject += " (közös)";
                    break;
                default:
                    return message.channel.send("Érvénytelen paraméter!");
            }
        } else if (!link || args.length !== 2) {
            return message.channel.send("Érvénytelen paraméter!");
        }
        message.channel.send(`${subject} Classroom linkje: ${link}`);

    }
}