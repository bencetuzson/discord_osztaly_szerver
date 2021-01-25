const { CONNREFUSED } = require("dns");

module.exports = {
    name: 'becenev',
    description: 'resets nicknames',
    admin : true,
    roles : [],
    guilds : [],
    execute(message, args, users) {
        console.log(message.guild.ownerID)
        const members = message.guild.members.cache;
        message.guild.members.cache.forEach(u => {
            if (u.id !== message.guild.ownerID) members.get(u.id).setNickname(nicknameSearch(u));
        });

        function nicknameSearch(user) {
            for (let index = 0; index < users.USERS.length; index++) {
                if (users.USERS[index].USER_ID === user.id) {
                    return users.USERS[index].NICKNAME;
                }
            }
        }
    }
}