module.exports = {
    name: 'szulinap',
    description: 'sends DM of arg\'s birthday',
    async execute(message, user, users, bot, args){
        let ind = null;
        let dm;
        for (let index = 0; index < users.USERS.length; index++) {
            if (users.USERS[index].NICKNAME.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === args[1].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || users.USERS[index].NICKNAME.toLowerCase() === args[1].toLowerCase()) {
                ind = index;
                if (message.guild != null) {
                    await message.channel.messages.fetch({limit: 1}).then(messages => {
                        message.channel.bulkDelete(messages);
                    });
                }
                break;
            } else if (users.USERS[index].USER_ID === args[1].replace("<", "").replace("@", "").replace("!", "").replace(">", "")) {
                ind = index;
                if (message.guild != null) {
                    await message.channel.messages.fetch({limit: 1}).then(messages => {
                        message.channel.bulkDelete(messages);
                    });
                }
                break;
            }
        }

        function monthToString() {
            switch (users.USERS[ind].BIRTHDAY.MONTH) {
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
                    break;
            }
        }

        if (ind != null) {
            if (bot.users.cache.get(users.USERS[ind].USER_ID) !== undefined) {
                dm = `${bot.users.cache.get(users.USERS[ind].USER_ID)} születésnapja: ${users.USERS[ind].BIRTHDAY.YEAR}. ${monthToString()} ${users.USERS[ind].BIRTHDAY.DAY}.`;
            } else {
                dm = `${users.USERS[ind].NICKNAME} születésnapja: ${users.USERS[ind].BIRTHDAY.YEAR}. ${monthToString()} ${users.USERS[ind].BIRTHDAY.DAY}.`;
            }
            if (message.guild == null) {
                message.channel.send(dm);
            } else {
                await message.author.send(dm);
            }
        } else {

            message.channel.send("Érvénytelen paraméter!");
            await message.channel.messages.fetch({ limit: 1 }).then(messages => {
                message.channel.bulkDelete(messages);
            });
            
        }
    }
}