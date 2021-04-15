module.exports = {
    name: 'szulinap',
    description: 'sends DM of arg\'s birthday',
    admin : false,
    roles : [],
    guilds : [],
    async execute(interaction, users, bot, args){
        const Discord = require('discord.js');
        let ind = null;
        let dm;
        switch(args[0].name) {
            case "lista":
                let allBD = [];
                for (ind = 0; ind < users.USERS.length; ++ind) {
                    if(users.USERS[ind].REAL){allBD.push({"NAME" : users.USERS[ind].NICKNAME, "DATE" : new Date(users.USERS[ind].BIRTHDAY.YEAR, users.USERS[ind].BIRTHDAY.MONTH-1, users.USERS[ind].BIRTHDAY.DAY, 0, 0, 0, 0)});}
                }
                for (ind = 0; ind < allBD.length; ++ind) {
                    if (allBD[ind] === undefined) allBD.splice(ind, 1);
                }
                const sortedBD = allBD.sort(function (a, b) {switch(args[0].options[0].value) {case "abc": let nameA = a.NAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); let nameB = b.NAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); if (nameA < nameB) { return -1; } if (nameA > nameB) { return 1; } return 0; case "datum": return a.DATE - b.DATE;}})
                let Embed = new Discord.MessageEmbed();
                let BDstring = "";
                for (ind = 0; ind < sortedBD.length; ++ind) {
                    BDstring += `**${sortedBD[ind].NAME}**: ${sortedBD[ind].DATE.getFullYear()}. ${monthToString(sortedBD[ind].DATE.getMonth()+1)} ${sortedBD[ind].DATE.getDate()}.\n`;
                }
                Embed
                .setTitle("Születésnapok")
                .addField(`${sortBy()} szerint rendezve`, BDstring)
                .setColor('RANDOM');
                bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
                    embeds: [Embed]
                }}});
                break;
            default:
                switch (args[0].name) {
                    case "név":
                        for (let index = 0; index < users.USERS.length; index++) {
                            if (users.USERS[index].NICKNAME.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === args[0].options[0].options[0].value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || users.USERS[index].NICKNAME.toLowerCase() === args[0].options[0].options[0].value.toLowerCase()) {
                                ind = index;
                                break;
                            }
                        }
                        break;
                    case "tag":
                        for (let index = 0; index < users.USERS.length; index++) {
                            if (users.USERS[index].USER_ID === args[0].options[0].value) {
                                ind = index;
                                break;
                            }
                        }
                        break;
                }
                if (ind != null) {
                    if (users.USERS[ind].USER_ID) {
                        dm = `<@!${users.USERS[ind].USER_ID}> születésnapja: ${users.USERS[ind].BIRTHDAY.YEAR}. ${monthToString(users.USERS[ind].BIRTHDAY.MONTH)} ${users.USERS[ind].BIRTHDAY.DAY}.`;
                    } else {
                        dm = `${users.USERS[ind].NICKNAME} születésnapja: ${users.USERS[ind].BIRTHDAY.YEAR}. ${monthToString(users.USERS[ind].BIRTHDAY.MONTH)} ${users.USERS[ind].BIRTHDAY.DAY}.`;
                    }
                    bot.users.cache.get(interaction.member.user.id).send(dm);
                    bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
                        content: `${bot.users.cache.get(interaction.member.user.id)}, nézd meg, mit küldtem DM-ben!`
                    }}}).then(() => {
                        setTimeout(() => {
                            bot.channels.cache.get(interaction.channel_id).messages.fetch({limit: 1}).then(messages => {
                                bot.channels.cache.get(interaction.channel_id).bulkDelete(messages);
                            })
                        }, 3000);
                    });
                } else {
                    bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
                        content: "Érvénytelen paraméter!"
                    }}}).then(() => {
                        setTimeout(() => { bot.channels.cache.get(interaction.channel_id).messages.fetch({ limit: 1 }).then(messages => {
                            bot.channels.cache.get(interaction.channel_id).bulkDelete(messages);
                        })}, 3000);
                    });
                }
                break;
        }
        function sortBy() {
            switch (args[0].options[0].value) {
                case "abc":
                    return "Név";
                case "datum":
                    return "Születésnap";
            }
        }

        function monthToString(month) {
            switch (month) {
                case 1:
                    return "Január";
                case 2:
                    return "Február";
                case 3:
                    return "Március";
                case 4:
                    return "Április";
                case 5:
                    return "Május";
                case 6:
                    return "Június";
                case 7:
                    return "Július";
                case 8:
                    return "Augusztus";
                case 9:
                    return "Szeptember";
                case 10:
                    return "Október";
                case 11:
                    return "November";
                case 12:
                    return "December";
                default:
                    return month;
            }
        }
    }
}
