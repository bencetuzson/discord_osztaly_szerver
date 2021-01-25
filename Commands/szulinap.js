module.exports = {
    name: 'szulinap',
    description: 'sends DM of arg\'s birthday',
    admin : false,
    roles : [],
    guilds : [],
    async execute(message, users, bot, args){
        const Discord = require('discord.js');
        let ind = null;
        let dm;
        switch(args[1]) {
            case undefined:
                message.channel.send("Érvénytelen paraméter!");
                break;
            case "abc":
            case "datum":
                let allBD = [];
                console.log(users.USERS.length);
                for (ind = 0; ind < users.USERS.length; ++ind) {
                    if(users.USERS[ind].REAL){allBD.push({"NAME" : users.USERS[ind].NICKNAME, "DATE" : new Date(users.USERS[ind].BIRTHDAY.YEAR, users.USERS[ind].BIRTHDAY.MONTH-1, users.USERS[ind].BIRTHDAY.DAY, 0, 0, 0, 0)});}
                }
                console.log(allBD.length)
                for (ind = 0; ind < allBD.length; ++ind) {
                    if (allBD[ind] === undefined) allBD.splice(ind, 1);
                }
                const sortedBD = allBD.sort(function (a, b) {switch(args[1]){case "abc": let nameA = a.NAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); let nameB = b.NAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); if (nameA < nameB) { return -1; } if (nameA > nameB) { return 1; } return 0; case "datum": return a.DATE - b.DATE;}})
                /*
                let NameSring = "";
                for (ind = 0; ind < sortedBD.length; ++ind) {
                    NameSring += `**${sortedBD[ind].NAME}**:${sortedBD.length !== ind ? "\n" : ""}`
                }
                let BDstring = "";
                for (ind = 0; ind < sortedBD.length; ++ind) {
                    BDstring += `${sortedBD[ind].DATE.getFullYear()}. ${monthToString(sortedBD[ind].DATE.getMonth()+1)} ${sortedBD[ind].DATE.getDate()}.${sortedBD.length !== ind ? "\n" : ""}`
                }
                */
                let Embed = new Discord.MessageEmbed();
                let BDstring = "";
                for (ind = 0; ind < sortedBD.length; ++ind) {
                    BDstring += `**${sortedBD[ind].NAME}**: ${sortedBD[ind].DATE.getFullYear()}. ${monthToString(sortedBD[ind].DATE.getMonth()+1)} ${sortedBD[ind].DATE.getDate()}.\n`;
                }
                Embed
                .setTitle("Születésnapok")
                .addField(`${sortBy()} szerint rendezve`, BDstring)
                /*.setFields(
                    { name: '\u200B', value: NameSring, inline: true },
		            { name: '\u200B', value: BDstring, inline: true }
                )*/
                .setColor('RANDOM');
                message.author.send(Embed);
                if (!isDM()) await message.channel.messages.fetch({ limit: 1 }).then(messages => {
                    message.channel.bulkDelete(messages);
                });
                break;
            default:
                for (let index = 0; index < users.USERS.length; index++) {
                    if (users.USERS[index].NICKNAME.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === args[1].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || users.USERS[index].NICKNAME.toLowerCase() === args[1].toLowerCase()) {
                        ind = index;
                        if (message.guild != null) {
                            if (!isDM()) await message.channel.messages.fetch({limit: 1}).then(messages => {
                                message.channel.bulkDelete(messages);
                            });
                        }
                        break;
                    } else if (users.USERS[index].USER_ID === args[1].replace("<", "").replace("@", "").replace("!", "").replace(">", "")) {
                        ind = index;
                        if (message.guild != null) {
                            if (!isDM()) await message.channel.messages.fetch({limit: 1}).then(messages => {
                                message.channel.bulkDelete(messages);
                            });
                        }
                        break;
                    }
                }

                function sortBy() {
                    switch(args[1]) {
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
        
                if (ind != null) {
                    if (users.USERS[ind].USER_ID) {
                        dm = `<@!${users.USERS[ind].USER_ID}> születésnapja: ${users.USERS[ind].BIRTHDAY.YEAR}. ${monthToString(users.USERS[ind].BIRTHDAY.MONTH)} ${users.USERS[ind].BIRTHDAY.DAY}.`;
                    } else {
                        dm = `${users.USERS[ind].NICKNAME} születésnapja: ${users.USERS[ind].BIRTHDAY.YEAR}. ${monthToString(users.USERS[ind].BIRTHDAY.MONTH)} ${users.USERS[ind].BIRTHDAY.DAY}.`;
                    }
                    if (message.guild == null) {
                        message.channel.send(dm);
                    } else {
                        await message.author.send(dm);
                    }
                } else {
        
                    message.channel.send("Érvénytelen paraméter!");
                    if (!isDM()) await message.channel.messages.fetch({ limit: 1 }).then(messages => {
                        message.channel.bulkDelete(messages);
                    });
                    
                }
                break;
        }

        function isDM() {return message.guild === null;}
        
    }
}