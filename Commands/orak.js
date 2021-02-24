const Discord = require('discord.js');

module.exports = {
    name: 'orak',
    description: 'writes out the lessons on a specific day',
    admin : false,
    roles : [],
    guilds : [],
    execute: function (message, args, users, timetable) {
        const now = new Date();
        let time;
        let temp = new Date();
        let index = null;
        const week_eng_it = timetable.WEEK.ENG_IT;
        const week_art = timetable.WEEK.ART;
        temp.setHours(23);
        temp.setMinutes(59);
        const Embed = new Discord.MessageEmbed()
            .setColor('RANDOM');

        switch (args.length) {
            case 1:
                time = now;
                Embed.setTitle(`**Órák ma:**`);
                break;
            case 2:
                if (args[1] === "h") {
                    time = now;
                    time.setDate(time.getDate() + 1);
                    Embed.setTitle(`**Órák holnap:**`);
                } else if (!isNaN(args[1])) {
                    time = now;
                    time.setDate(time.getDate() + args[1]);
                    Embed.setTitle(`**Órák ${args[1]} nap múlva:**`);
                } else {
                    message.channel.send("Érvénytelen paraméter!");
                    return;
                }
                break;
            case 4:
                time = new Date(args[1], args[2], args[3]);
                Embed.setTitle(`**Órák ekkor: ${args[1]}. ${args[2] < 10 ? "0" : ""}${args[2]}. ${args[3] < 10 ? "0" : ""}${args[3]}. ${day(time.getDay())}:**`);
                break;
        }

        if (time.getDay() === 0 || time.getDay() === 6) {
            message.channel.send("Hétvégén nincs óra!");
            return;
        }

        lesson(time.getDay() - 1)
        message.channel.send(Embed)

        function lesson(d) {
            for (index = 0; index < timetable.TIMETABLE.length; index++) {
                Embed.addField(nextLesson(timetable.TIMETABLE[d][index].LESSON, timetable.TIMETABLE[d][index].TYPE), `Idő: ${timetable.TIMETABLE[d][index].TIME.FROM.HOUR}:${timetable.TIMETABLE[d][index].TIME.FROM.MINUTE < 10 ? 0 : ""}${timetable.TIMETABLE[d][index].TIME.FROM.MINUTE} - ${timetable.TIMETABLE[d][index].TIME.TO.HOUR}:${timetable.TIMETABLE[d][index].TIME.TO.MINUTE < 10 ? 0 : ""}${timetable.TIMETABLE[d][index].TIME.TO.MINUTE}${timetable.TIMETABLE[d][index].DESCRIPTION !== "" ? `\nMegjegyzés: ${timetable.TIMETABLE[d][index].DESCRIPTION}` : ""}`)
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
                if (users.USERS[index].USER_ID === message.member.user.id) {
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
                if (users.USERS[i].USER_ID === message.member.user.id) {
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
    }
}