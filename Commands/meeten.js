const Discord = require('discord.js');
delete require.cache[require.resolve("../../database/timetable.json")];

module.exports = {
    name: 'meeten',
    description: 'writes out the link of the requested lesson\'s Classroom',
    admin : false,
    roles : [],
    guilds : [],
    execute: async function (message, args, users, timetable, meetIndex) {
        let names = [];
        let ind;
        for (ind = 0; ind < users.USERS.length; ++ind) {
            if(users.USERS[ind].REAL){names.push(users.USERS[ind]);}
        }
        const userList = names.sort(function (a, b) {
            let nameA = a.LASTNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            let nameB = b.LASTNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            let nameC = a.FIRSTNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            let nameD = b.FIRSTNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (nameA < nameB) { return -1; } if (nameA > nameB) { return 1; } if (nameC < nameD) { return -1; } if (nameC > nameD) { return 1; } return 0;
        })
        const Embed = new Discord.MessageEmbed()
            .setTitle(`${userList[meetIndex].NICKNAME} van meet-en?`)
            .setDescription(`${meetIndex + 1}/${userList.length}`)
            .setColor(message.guild.roles.cache.get(userList[meetIndex].ROLE_ID).color === 0 ? 'RANDOM' : message.guild.roles.cache.get(userList[meetIndex].ROLE_ID).color);
        const msg = await message.channel.send(Embed);
        msg.react("✅");
        msg.react("❌");
        console.log(msg.channel.id);
        console.log(msg.id);
        return {channel: msg.channel.id, message: msg.id, user: userList[meetIndex]}
    }
}