const Discord = require('discord.js');
const timetable = require("../../database/timetable.json");

module.exports = {
    name: 'jon',
    description: 'writes out the next lesson',
    execute(message, args) {
        const now = new Date();
        const time = new Date();
        let temp = new Date();
        let index = null;
        temp.setHours(23);
        temp.setMinutes(59);

        if (now.getDay() !== 6 && now.getDay() !== 0) {
            for (let i = 0; i < timetable.TIMETABLE[now.getDay()-1].length; i++) {
                time.setHours(timetable.TIMETABLE[now.getDay()-1][i].TIME.FROM.HOUR);
                time.setMinutes(timetable.TIMETABLE[now.getDay()-1][i].TIME.FROM.MINUTE);
                if (time < temp && time > now) {
                    temp.setHours(timetable.TIMETABLE[now.getDay()-1][i].TIME.FROM.HOUR);
                    temp.setMinutes(timetable.TIMETABLE[now.getDay()-1][i].TIME.FROM.MINUTE);
                    index = i;
                }
            }

            if (index != null) {
                const Embed = new Discord.MessageEmbed()
                .setTitle('**A következő óra ma:**')
                .setDescription(`**${timetable.TIMETABLE[now.getDay()-1][index].LESSON}**`)
                .addFields(
                    { name: 'Idő:', value: `${timetable.TIMETABLE[now.getDay()-1][index].TIME.FROM.HOUR}:${timetable.TIMETABLE[now.getDay()-1][index].TIME.FROM.MINUTE} - ${timetable.TIMETABLE[now.getDay()-1][index].TIME.TO.HOUR}:${timetable.TIMETABLE[now.getDay()-1][index].TIME.TO.MINUTE}`}
                )
                //.addField(timetable.TIMETABLE[now.getDay()-1][index].DESCRIPTION)
                .setColor('RANDOM');
                if (timetable.TIMETABLE[now.getDay()-1][index].DESCRIPTION !== "") {
                    Embed.addField('Megjegyzés:', `${timetable.TIMETABLE[now.getDay()-1][index].DESCRIPTION}`);
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