const Discord = require('discord.js');

module.exports = {
    name: 'orak',
    description: 'writes out the lessons on a specific day',
    admin : false,
    roles : [],
    guilds : [],
    execute: function (interaction, args, users, timetable, bot) {
        const now = new Date();
        let time;
        let temp = new Date();
        let index = null;
        let week_day = 0;
        let week_add = 0;
        const week_eng_it = timetable.WEEK.ENG_IT;
        const week_art = timetable.WEEK.ART;
        const datePrint = () => { return `${time.getFullYear()}. ${time.getMonth() < 10 ? "0" : ""}${time.getMonth()}. ${time.getDate() < 10 ? "0" : ""}${time.getDate()}.`}
        temp.setHours(23);
        temp.setMinutes(59);
        const Embed = new Discord.MessageEmbed()
            .setFooter("Ha több óra is van párhuhamosan, akkor az aláhúzott lesz a tiéd.\nEzért nem is biztos, hogy ami másnak ki lett írva, az neked is jó!")
            .setColor('RANDOM');
        console.log(args[0].name);
        switch (args[0].name) {
            case "ma":
                time = now;
                Embed.setTitle(`**Órák ma (${datePrint()} ${day(time.getDay())}):**`);
                break;
            case "hét":
                week_day = weekDay(args[0].options[0].value);
                console.log(week_day);
                time = now;
                if (args[0].options[1]) {
                    week_add = args[0].options[1].value;
                    time.setDate(time.getDate() + week_day + week_add * 7);
                    Embed.setTitle(`**Órák ${week_add === 0 ? "ezen a héten" : (Math.abs(week_add) === 1 ? (week_add === 1 ? "jövő hét" : "múlt hét") : (`${Math.abs(week_add)} ${week_add > 1 ? "hét múlva" : "héttel ezelőtt"}`))} ${onDay(time.getDay())} (${datePrint()}):**`);
                } else {
                    time.setDate(time.getDate() + week_day);
                    Embed.setTitle(`**Órák ezen a héten ${onDay(time.getDay())} (${datePrint()}):**`);
                }
                break;
            case "múlva":
                if (args[0].options[1] && args[0].options[0].value !== 0) {
                    week_add = args[0].options[1].value + Math.floor(args[0].options[0].value / 7);
                    time = now;
                    time.setDate(time.getDate() + args[0].options[0].value + args[0].options[1].value * 7);
                    Embed.setTitle(`**Órák ${week_add === 0 ? "ezen a héten" : (Math.abs(week_add) === 1 ? (week_add === 1 ? "jövő hét" : "múlt hét") : (`${Math.abs(week_add)} ${week_add > 1 ? "hét múlva" : "héttel ezelőtt"}`))} ${onDay(time.getDay())} (${datePrint()}):**`);
                } else {
                    switch (args[0].options[0].value) {
                        case -2:
                            time = now;
                            time.setDate(time.getDate() - 2);
                            Embed.setTitle(`**Órák tegnapelőtt (${datePrint()} ${day(time.getDay())}):**`);
                            break;
                        case -1:
                            time = now;
                            time.setDate(time.getDate() - 1);
                            Embed.setTitle(`**Órák tegnap (${datePrint()} ${day(time.getDay())}):**`);
                            break;
                        case 0:
                            time = now;
                            Embed.setTitle(`**Órák ma (${datePrint()} ${day(time.getDay())}):**`);
                            break;
                        case 1:
                            time = now;
                            time.setDate(time.getDate() + 1);
                            Embed.setTitle(`**Órák holnap (${datePrint()} ${day(time.getDay())}):**`);
                            break;
                        case 2:
                            time = now;
                            time.setDate(time.getDate() + 2);
                            Embed.setTitle(`**Órák holnapután (${datePrint()} ${day(time.getDay())}):**`);
                            break;
                        default:
                            if (Math.abs(args[0].options[0].value) >= 7) {
                                time = now;
                                time.setDate(time.getDate() + args[0].options[0].value);
                                Embed.setTitle(`**Órák ${Math.floor(args[0].options[0].value / 7) === 0 ? "ezen a héten" : (Math.abs(Math.floor(args[0].options[0].value / 7)) === 1 ? (Math.floor(args[0].options[0].value / 7) === 1 ? "jövő hét" : "múlt hét") : (`${Math.abs(Math.floor(args[0].options[0].value / 7))} ${Math.floor(args[0].options[0].value / 7) > 1 ? "hét múlva" : "héttel ezelőtt"}`))} ${onDay(time.getDay())} (${datePrint()}):**`);
                            } else {
                                time = now;
                                time.setDate(time.getDate() + args[0].options[0].value);
                                Embed.setTitle(`**Órák ${Math.abs(args[0].options[0].value)} ${args[0].options[0].value > 0 ? "nap múlva" : "nappal ezelőtt"}, ${datePrint()}:**`);
                            }
                            break;
                    }
                }
                break;
            case "dátum":
                time = new Date(args[0].options[0].value, args[0].options[1].value - 1, args[0].options[2].value);
                console.log(Number(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1)))
                console.log(Number(time))
                console.log(Number(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1)) === Number(time))
                const diff = (n) => { return Number(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + n)) };
                switch (Number(time)) {
                    case diff(-2):
                        Embed.setTitle(`**Órák tegnapelőtt (${datePrint()} ${day(time.getDay())}):**`);
                        break;
                    case diff(-1):
                        Embed.setTitle(`**Órák tegnap (${datePrint()} ${day(time.getDay())}):**`);
                        break;
                    case diff(0):
                        Embed.setTitle(`**Órák ma (${datePrint()} ${day(time.getDay())}):**`);
                        break;
                    case diff(1):
                        Embed.setTitle(`**Órák holnap (${datePrint()} ${day(time.getDay())}):**`);
                        break;
                    case diff(2):
                        Embed.setTitle(`**Órák holnapután (${datePrint()} ${day(time.getDay())}):**`);
                        break;
                    default:
                        Embed.setTitle(`**Órák ekkor: ${args[0].options[0].value}. ${args[0].options[1].value < 10 ? "0" : ""}${args[0].options[1].value}. ${args[0].options[2].value < 10 ? "0" : ""}${args[0].options[2].value}. ${day(time.getDay())}:**`);
                        break;

                }
                console.log(time);
                break;
        }
        if (time.getDay() === 0 || time.getDay() === 6) {
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
                content: "Hétvégén nincs óra!"
            }}});
            return;
        }
        console.log(time);
        lesson(time.getDay() - 1)
        bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
            embeds: [Embed]
        }}});

        function lesson(d) {
            for (index = 0; index < timetable.TIMETABLE.length; index++) {
                Embed.addField(nextLesson(timetable.TIMETABLE[d][index].LESSON, timetable.TIMETABLE[d][index].TYPE), `Idő: ${timetable.TIMETABLE[d][index].TIME.FROM.HOUR}:${timetable.TIMETABLE[d][index].TIME.FROM.MINUTE < 10 ? 0 : ""}${timetable.TIMETABLE[d][index].TIME.FROM.MINUTE} - ${timetable.TIMETABLE[d][index].TIME.TO.HOUR}:${timetable.TIMETABLE[d][index].TIME.TO.MINUTE < 10 ? 0 : ""}${timetable.TIMETABLE[d][index].TIME.TO.MINUTE}${timetable.TIMETABLE[d][index].DESCRIPTION !== "" ? `\nMegjegyzés: ${timetable.TIMETABLE[d][index].DESCRIPTION}` : ""}`)
            }
        }

        function weekDay (d) {
            switch (d) {
                case "hétfő":
                    return 1 - now.getDay();
                case "kedd":
                    return 2 - now.getDay();
                case "szerda":
                    return 3 - now.getDay();
                case "csütörtök":
                    return 4 - now.getDay();
                case "péntek":
                    return 5 - now.getDay();
            }
        }

        function getWeekNumber(d) {
            d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
            d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
            var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        }

        /*function whichLesson(day, fromDatabase, ...[lesson1, lesson2, lessonPrefix]) {
            if (getWeekNumber(now) % 2 === 0) {
                for (let i = 0; i < arguments.length; i++) {
                    if (fromDatabase === `${arguments[i+2[0]]}/${i+2[1]}`) {

                    }
                }
            }
        }*/

        function whichLanguage(lesson) {
            let arr = lesson.split("/");
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === languageSearch()) {
                    arr[i] = `__${arr[i]}__`
                    return arr.toString().replace(",", "/").replace("[", "").replace("]", "");
                }
            }
        }

        function whichLesson(lesson) {
            let arr = lesson.split("/");
            if (getWeekNumber(time) % 2 === week_eng_it) {
                if (time.getDay() === 1) {
                    switch (users.USERS[userSearch()].SUBJECTS.GROUPS) {
                        case 1:
                            arr[0] = `__${arr[0]}__`;
                            break;
                        case 2:
                            arr[1] = `__${arr[1]}__`;
                            break;
                    }
                } else if (time.getDay() === 2) {
                    switch (users.USERS[userSearch()].SUBJECTS.GROUPS) {
                        case 1:
                            arr[1] = `__${arr[1]}__`;
                            break;
                        case 2:
                            arr[0] = `__${arr[0]}__`;
                            break;
                    }
                }
            } else {
                if (time.getDay() === 2) {
                    switch (users.USERS[userSearch()].SUBJECTS.GROUPS) {
                        case 1:
                            arr[0] = `__${arr[0]}__`;
                            break;
                        case 2:
                            arr[1] = `__${arr[1]}__`;
                            break;
                    }
                } else if (time.getDay() === 1) {
                    switch (users.USERS[userSearch()].SUBJECTS.GROUPS) {
                        case 1:
                            arr[1] = `__${arr[1]}__`;
                            break;
                        case 2:
                            arr[0] = `__${arr[0]}__`;
                            break;
                    }
                }
            }
            return arr.toString().replace(",", "/").replace("[", "").replace("]", "");
        }

        function whichArt(lesson) {
            let arr = lesson.split("/");
            if (getWeekNumber(time) % 2 === week_art) {
                return arr[0];
            } else {
                return arr[1];
            }
        }

        function nextLesson(lesson, type) {
            console.log(type);
            switch (type) {
                case "L":
                    console.log("L");
                    return whichLanguage(lesson);
                case "I":
                    console.log("I");
                    return whichLesson(lesson);
                case "A":
                    console.log("A");
                    return whichArt(lesson);
                default:
                    console.log("default");
                    return lesson;
            }
        }

        function languageSearch() {
            for (let index = 0; index < users.USERS.length; index++) {
                if (users.USERS[index].USER_ID === interaction.member.user.id) {
                    console.log(timetable.LANGUAGES.length);
                    for (let i = 0; i < timetable.LANGUAGES.length; i++) {
                        console.log(timetable.LANGUAGES[i].CHAR);
                        console.log(timetable.LANGUAGES[i].SUBJECT);
                        if (timetable.LANGUAGES[i].CHAR === users.USERS[index].SUBJECTS.LANGUAGE) {
                            console.log("success");
                            return timetable.LANGUAGES[i].SUBJECT;
                        }
                    }
                }
            }
        }

        function typeSearch() {
            for (let index = 0; index < timetable.TIMETABLE[time.getDay()-1].length; index++) {
                console.log(timetable.TIMETABLE[time.getDay()-1][index].TYPE);
                console.log(timetable.TIMETABLE[time.getDay()-1][index].LESSON);
                if (timetable.TIMETABLE[time.getDay()-1][index].TYPE !== null) {
                    console.log(index);
                    return timetable.TIMETABLE[time.getDay()-1][index].TYPE;
                }
            }
        }

        function userSearch() {
            for (let i = 0; i < users.USERS.length; i++) {
                if (users.USERS[i].USER_ID === interaction.member.user.id) {
                    return i;
                }
            }
        }

        function day(d) {
            switch (d) {
                case 1:
                    return "Hétfő";
                case 2:
                    return "Kedd";
                case 3:
                    return "Szerda";
                case 4:
                    return "Csütörtök";
                case 5:
                    return "Péntek";
            }
        }

        function onDay(d) {
            switch (d) {
                case 1:
                    return "hétfőn";
                case 2:
                    return "kedden";
                case 3:
                    return "szerdán";
                case 4:
                    return "csütörtökön";
                case 5:
                    return "pénteken";
            }
        }
    }
}