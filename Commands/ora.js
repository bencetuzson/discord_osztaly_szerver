const Discord = require('discord.js');
delete require.cache[require.resolve("../../database/timetable.json")];

module.exports = {
    name: 'ora',
    description: 'writes out the next lesson',
    admin : false,
    roles : [],
    guilds : [],
    execute: function (interaction, args, users, timetable, bot, type) {
        const now = new Date();
        let index = null;
        const week_eng_it = timetable.WEEK.ENG_IT;
        const week_art = timetable.WEEK.ART;
        let meet;
        let classroom;
        const time = new Date();
        let temp = new Date();
        temp.setHours(23);
        temp.setMinutes(59);
        const from = new Date();
        const to = new Date();
        if (type !== "jon" && type !== "most") return;

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
                    meet = timetable.MEET[languageSearch()];
                    classroom = timetable.CLASSROOM[languageSearch()];
                    return arr.toString().replace(",", "/").replace("[", "").replace("]", "");
                }
            }
        }

        function whichLesson(lesson) {
            let arr = lesson.split("/");
            if (getWeekNumber(now) % 2 === week_eng_it) {
                if (now.getDay() === 1) {
                    switch (users.USERS[userSearch()].SUBJECTS.GROUPS) {
                        case 1:
                            arr[0] = `__${arr[0]}__`;
                            meet = timetable.MEET.Angol.G1;
                            classroom = timetable.CLASSROOM.Angol.G1;
                            break;
                        case 2:
                            arr[1] = `__${arr[1]}__`;
                            meet = timetable.MEET.Info.G2;
                            classroom = timetable.CLASSROOM.Info.G2;
                            break;
                    }
                } else if (now.getDay() === 2) {
                    switch (users.USERS[userSearch()].SUBJECTS.GROUPS) {
                        case 1:
                            arr[1] = `__${arr[1]}__`;
                            meet = timetable.MEET.Info.G1;
                            classroom = timetable.CLASSROOM.Info.G1;
                            break;
                        case 2:
                            arr[0] = `__${arr[0]}__`;
                            meet = timetable.MEET.Angol.G2;
                            classroom = timetable.CLASSROOM.Angol.G2;
                            break;
                    }
                }
            } else {
                if (now.getDay() === 2) {
                    switch (users.USERS[userSearch()].SUBJECTS.GROUPS) {
                        case 1:
                            arr[0] = `__${arr[0]}__`;
                            meet = timetable.MEET.Angol.G1;
                            classroom = timetable.CLASSROOM.Angol.G1;
                            break;
                        case 2:
                            arr[1] = `__${arr[1]}__`;
                            meet = timetable.MEET.Info.G2;
                            classroom = timetable.CLASSROOM.Info.G2;
                            break;
                    }
                } else if (now.getDay() === 1) {
                    switch (users.USERS[userSearch()].SUBJECTS.GROUPS) {
                        case 1:
                            arr[1] = `__${arr[1]}__`;
                            meet = timetable.MEET.Info.G1;
                            classroom = timetable.CLASSROOM.Info.G1;
                            break;
                        case 2:
                            arr[0] = `__${arr[0]}__`;
                            meet = timetable.MEET.Angol.G2;
                            classroom = timetable.CLASSROOM.Angol.G2;
                            break;
                    }
                }
            }
            return arr.toString().replace(",", "/").replace("[", "").replace("]", "");
        }

        function whichArt(lesson) {
            classroom = timetable.CLASSROOM[lesson];
            let arr = lesson.split("/");
            if (getWeekNumber(now) % 2 === week_art) {
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
                    if (lesson === "Tesi") {
                        switch (users.USERS[userSearch()].GENDER) {
                            case "M":
                                meet = timetable.MEET[lesson].BOYS;
                                classroom = timetable.CLASSROOM[lesson].BOYS;
                                break;
                            case "F":
                                meet = timetable.MEET[lesson].GIRLS;
                                classroom = timetable.CLASSROOM[lesson].GIRLS;
                                break;
                        }
                    } else if (lesson === "Angol") {
                        switch (users.USERS[userSearch()].SUBJECTS.GROUPS) {
                            case 1:
                                meet = timetable.MEET[lesson].G1;
                                classroom = timetable.CLASSROOM[lesson].G1;
                                break;
                            case 2:
                                meet = timetable.MEET[lesson].G2;
                                classroom = timetable.CLASSROOM[lesson].G2;
                                break;
                        }
                    } else {
                        meet = timetable.MEET[lesson];
                        classroom = timetable.CLASSROOM[lesson];
                    }
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
                if (users.USERS[i].USER_ID === interaction.member.user.id) {
                    return i;
                }
            }
        }

        if (now.getDay() !== 6 && now.getDay() !== 0) {
            switch (type) {
                case "jon":
                    for (let i = 0; i < timetable.TIMETABLE[now.getDay() - 1].length; i++) {
                        time.setHours(timetable.TIMETABLE[now.getDay() - 1][i].TIME.FROM.HOUR);
                        time.setMinutes(timetable.TIMETABLE[now.getDay() - 1][i].TIME.FROM.MINUTE);
                        if (time < temp && time > now) {
                            temp.setHours(timetable.TIMETABLE[now.getDay() - 1][i].TIME.FROM.HOUR);
                            temp.setMinutes(timetable.TIMETABLE[now.getDay() - 1][i].TIME.FROM.MINUTE);
                            index = i;
                        }
                    }
                    break;
                case "most":
                    for (let i = 0; i < timetable.TIMETABLE[now.getDay() - 1].length; i++) {
                        from.setHours(timetable.TIMETABLE[now.getDay() - 1][i].TIME.FROM.HOUR);
                        from.setMinutes(timetable.TIMETABLE[now.getDay() - 1][i].TIME.FROM.MINUTE);
                        to.setHours(timetable.TIMETABLE[now.getDay() - 1][i].TIME.TO.HOUR);
                        to.setMinutes(timetable.TIMETABLE[now.getDay() - 1][i].TIME.TO.MINUTE);
                        if (from <= now && now < to) {
                            index = i;
                        }
                    }
                    break;
            }
            if (index != null) {
                const Embed = new Discord.MessageEmbed()
                    .setTitle(type === "jon" ? '**A következő óra ma:**' : '**A most zajló óra:**')
                    .setDescription(`**${nextLesson(timetable.TIMETABLE[now.getDay() - 1][index].LESSON, timetable.TIMETABLE[now.getDay()-1][index].TYPE)}**`)
                    .addField('Idő:', `${timetable.TIMETABLE[now.getDay() - 1][index].TIME.FROM.HOUR}:${timetable.TIMETABLE[now.getDay() - 1][index].TIME.FROM.MINUTE < 10 ? 0 : ""}${timetable.TIMETABLE[now.getDay() - 1][index].TIME.FROM.MINUTE} - ${timetable.TIMETABLE[now.getDay() - 1][index].TIME.TO.HOUR}:${timetable.TIMETABLE[now.getDay() - 1][index].TIME.TO.MINUTE < 10 ? 0 : ""}${timetable.TIMETABLE[now.getDay() - 1][index].TIME.TO.MINUTE}`)
                    //.addField(timetable.TIMETABLE[now.getDay()-1][index].DESCRIPTION)
                    .setColor('RANDOM')
                    .setFooter("Ha több óra is van párhuhamosan, akkor az aláhúzott lesz a tiéd.\nEzért nem is biztos, hogy ami másnak ki lett írva, az neked is jó!");
                if (timetable.TIMETABLE[now.getDay() - 1][index].DESCRIPTION !== "") {
                    Embed.addField('Megjegyzés:', `${timetable.TIMETABLE[now.getDay() - 1][index].DESCRIPTION}`);
                }
                if (meet) {
                    Embed.addField('Meet link:', `${meet}`);
                }
                if (classroom) {
                    Embed.addField('Classroom link', `${classroom}`);
                }
                bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
                    embeds: [Embed]
                }}});
            } else {
                bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
                    content: type === "jon" ? "Ma nincs több óra!" : "Most nincs óra!"
                }}});
            }

        } else {
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
                content: "Hétvégén nincs óra!"
            }}});
        }
    }
}