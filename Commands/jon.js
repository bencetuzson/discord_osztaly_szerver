const Discord = require('discord.js');
const timetable = require("../../database/timetable.json");

module.exports = {
    name: 'jon',
    description: 'writes out the next lesson',
    execute: function (message, args, user, users) {
        const now = new Date();
        const time = new Date();
        let temp = new Date();
        let index = null;
        console.log(now.getDay());
        temp.setHours(23);
        temp.setMinutes(59);

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

        function whichLanguage(user, lesson) {
            let arr = lesson.split("/");
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === languageSearch()) {
                    arr[i] = `__${arr[i]}__`
                    return arr.toString().replace(",", "/").replace("[", "").replace("]", "");
                }
            }
        }

        function whichLesson(user, lesson) {
            let arr = lesson.split("/");
            if (getWeekNumber(now) % 2 === 1) {
                if (now.getDay() === 1) {
                    switch (users.USERS[userSearch()].SUBJECTS.GROUPS) {
                        case 1:
                            arr[0] = `__${arr[0]}__`;
                            break;
                        case 2:
                            arr[1] = `__${arr[1]}__`;
                            break;
                    }
                } else if (now.getDay() === 2) {
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
                if (now.getDay() === 2) {
                    switch (users.USERS[userSearch()].SUBJECTS.GROUPS) {
                        case 1:
                            arr[0] = `__${arr[0]}__`;
                            break;
                        case 2:
                            arr[1] = `__${arr[1]}__`;
                            break;
                    }
                } else if (now.getDay() === 1) {
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

        function whichArt(user, lesson) {
            let arr = lesson.split("/");
            if (getWeekNumber(now) % 2 === 1) {
                return arr[0];
            } else {
                return arr[1];
            }
        }

        function nextLesson(user, lesson, type) {
            console.log(type);
            switch (type) {
                case "L":
                    console.log("L");
                    return whichLanguage(user, lesson);
                case "I":
                    console.log("I");
                    return whichLesson(user, lesson);
                case "A":
                    console.log("A");
                    return whichArt(user, lesson);
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
            for (let index = 0; index < timetable.TIMETABLE[now.getDay()-1].length; index++) {
                console.log(timetable.TIMETABLE[now.getDay()-1][index].TYPE);
                console.log(timetable.TIMETABLE[now.getDay()-1][index].LESSON);
                if (timetable.TIMETABLE[now.getDay()-1][index].TYPE !== null) {
                    console.log(index);
                    return timetable.TIMETABLE[now.getDay()-1][index].TYPE;
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

        if (now.getDay() !== 6 && now.getDay() !== 0) {
            for (let i = 0; i < timetable.TIMETABLE[now.getDay() - 1].length; i++) {
                time.setHours(timetable.TIMETABLE[now.getDay() - 1][i].TIME.FROM.HOUR);
                time.setMinutes(timetable.TIMETABLE[now.getDay() - 1][i].TIME.FROM.MINUTE);
                if (time < temp && time > now) {
                    temp.setHours(timetable.TIMETABLE[now.getDay() - 1][i].TIME.FROM.HOUR);
                    temp.setMinutes(timetable.TIMETABLE[now.getDay() - 1][i].TIME.FROM.MINUTE);
                    index = i;
                }
            }

            if (index != null) {
                const Embed = new Discord.MessageEmbed()
                    .setTitle('**A következő óra ma:**')
                    .setDescription(`**${nextLesson(message.member.user.id, timetable.TIMETABLE[now.getDay() - 1][index].LESSON, timetable.TIMETABLE[now.getDay()-1][index].TYPE)}**`)
                    .addFields(
                        {
                            name: 'Idő:',
                            value: `${timetable.TIMETABLE[now.getDay() - 1][index].TIME.FROM.HOUR}:${timetable.TIMETABLE[now.getDay() - 1][index].TIME.FROM.MINUTE} - ${timetable.TIMETABLE[now.getDay() - 1][index].TIME.TO.HOUR}:${timetable.TIMETABLE[now.getDay() - 1][index].TIME.TO.MINUTE}`
                        }
                    )
                    //.addField(timetable.TIMETABLE[now.getDay()-1][index].DESCRIPTION)
                    .setColor('RANDOM');
                if (timetable.TIMETABLE[now.getDay() - 1][index].DESCRIPTION !== "") {
                    Embed.addField('Megjegyzés:', `${timetable.TIMETABLE[now.getDay() - 1][index].DESCRIPTION}`);
                }
                message.channel.send(Embed);
            } else {
                message.channel.send("Ma nincs több óra!")
            }

        } else {
            message.channel.send("Hétvégén nincs óra!")
        }
    }
}