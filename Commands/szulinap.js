const Discord = require('discord.js');

module.exports = {
    name: 'szulinap',
    description: 'sends DM of arg\'s birthday',
    async execute(message, user, users, bot, args){
	await message.channel.messages.fetch({ limit: 1 }).then(messages => {
        	message.channel.bulkDelete(messages);
	});
        let ind = null;
        let dm;
        for (let index = 0; index < users.USERS.length; index++) {
            if (users.USERS[index].NICKNAME.toLowerCase() === args[1].toLowerCase()) {
                ind = index;
                break;
            } else if (bot.users.cache.get(users.USERS[index].USER_ID) === args[1].replace("<", "").replace("@", "").replace("!", "").replace(">", "")) {
                ind = index;
                break;
            }
        }

	console.log(`${message.member.user.tag} => ${users.USERS[ind].NICKNAME}`);

        function monthToString(month) {
            switch (month) {
                case 1:
                    return "Január";
                    break;
                case 2:
                    return "Február";
                    break;
                case 3:
                    return "Március";
                    break;
                case 4:
                    return "Április";
                    break;
                case 5:
                    return "Május";
                    break;
                case 6:
                    return "Június";
                    break;
                case 7:
                    return "Július";
                    break;
                case 8:
                    return "Augusztus";
                    break;
                case 9:
                    return "Szeptember";
                    break;
                case 10:
                    return "Október";
                    break;
                case 11:
                    return "November";
                    break;
                case 12:
                    return "December";
                    break;
                
                default:
		    return month;
                    break;
            }
        };

        function sleep(milliseconds) {
            const date = Date.now();
            let currentDate = null;
            do {
              currentDate = Date.now();
            } while (currentDate - date < milliseconds);
        }

        if (ind != null) {
            if (bot.users.cache.get(users.USERS[ind].USER_ID !== undefined)) {
                dm = `${bot.users.cache.get(users.USERS[ind].USER_ID)} születésnapja: ${users.USERS[ind].BIRTHDAY.YEAR}. ${monthToString()} ${users.USERS[ind].BIRTHDAY.DAY}.`;
            } else {
                dm = `${users.USERS[ind].NICKNAME} születésnapja: ${users.USERS[ind].BIRTHDAY.YEAR}. ${monthToString(users.USERS[ind].BIRTHDAY.MONTH)} ${users.USERS[ind].BIRTHDAY.DAY}.`;
            }
            bot.users.cache.get(message.member.user.id).send(dm);
        } else {

            let msg = message.channel.send("Érvénytelen paraméter!");
            await message.channel.messages.fetch({ limit: 1 }).then(messages => {
                message.channel.bulkDelete(messages);
            });
            
        }
    }
}