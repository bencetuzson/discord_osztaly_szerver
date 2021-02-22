const Discord = require('discord.js');

module.exports = {
    name: 'msg',
    description: 'picks',
    async execute(message, args, bot, users) {
        let ind;
        let id;
        for (let index = 0; index < users.USERS.length; index++) {
            if (users.USERS[index].NICKNAME.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === args[1].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || users.USERS[index].NICKNAME.toLowerCase() === args[1].toLowerCase()) {
                ind = index;
                id = users.USERS[index].USER_ID;
                break;
            } else if (users.USERS[index].USER_ID === args[1].replace("<", "").replace("@", "").replace("!", "").replace(">", "")) {
                ind = index;
                id = args[1].replace("<", "").replace("@", "").replace("!", "").replace(">", "");
                break;
            }
        }

        if (!id || args.length < 3) {
            message.channel.send("Érvénytelen paraméter!");
            return;
        }

        bot.users.cache.get(id).send(`Üzenet egy titkos feladótól: ${args.slice(2).join(' ')}`)
        message.channel.send(`Titkos üzenet neki: ${bot.users.cache.get(id)}, üzenet: ${args.slice(2).join(' ')}`);

    }
}
