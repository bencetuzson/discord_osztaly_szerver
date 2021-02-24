module.exports = {
    name: 'email',
    description: 'writes out the email address of the requested teacher or classmate',
    admin : false,
    roles : [],
    guilds : [],
    execute: function (message, args, users,) {
        let ind;
        let email;
        let name;
        for (let index = 0; index < users.USERS.length; index++) {
            if (users.USERS[index].NICKNAME.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === args[1].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || users.USERS[index].NICKNAME.toLowerCase() === args[1].toLowerCase()) {
                ind = index;
                email = users.USERS[index].EMAIL;
                name = users.USERS[index].NICKNAME;
                break;
            } else if (users.USERS[index].USER_ID === args[1].replace("<", "").replace("@", "").replace("!", "").replace(">", "")) {
                ind = index;
                email = users.USERS[index].EMAIL;
                break;
            }
        }
        if (!email) {
            for (let index = 0; index < users.TEACHERS.length; index++) {
                if (users.TEACHERS[index].NAME.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === args[1].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || users.TEACHERS[index].NAME.toLowerCase() === args[1].toLowerCase()) {
                    ind = index;
                    email = users.TEACHERS[index].EMAIL;
                    name = users.TEACHERS[index].NAME;
                    break;
                }
            }
            if (!email || args.length !== 2) {
                message.channel.send("Érvénytelen paraméter!");
                return;
            }
        }
        message.channel.send(`${name} email címe: ${email}@gyermekekhaza.hu`)
    }
}
