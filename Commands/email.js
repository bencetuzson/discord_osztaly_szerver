module.exports = {
    name: 'email',
    description: 'writes out the email address of the requested teacher or classmate',
    admin : false,
    roles : [],
    guilds : [],
    execute: function (interaction, args, users, bot) {
        let ind;
        let email;
        let name;
        switch (args[0].name) {
            case "név":
                switch (args[0].options[0].name) {
                    case "fiú":
                    case "lány":
                        for (let index = 0; index < users.USERS.length; index++) {
                            if (users.USERS[index].NICKNAME.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === args[0].options[0].options[0].value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || users.USERS[index].NICKNAME.toLowerCase() === args[0].options[0].options[0].value.toLowerCase()) {
                                ind = index;
                                email = users.USERS[index].EMAIL;
                                name = users.USERS[index].NICKNAME;
                                break;
                            }
                        }
                        break;
                    case "tanár":
                        for (let index = 0; index < users.TEACHERS.length; index++) {
                            if (users.TEACHERS[index].NAME.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === args[0].options[0].options[0].value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || users.TEACHERS[index].NAME.toLowerCase() === args[0].options[0].options[0].value.toLowerCase()) {
                                ind = index;
                                email = users.TEACHERS[index].EMAIL;
                                name = users.TEACHERS[index].NAME;
                                break;
                            }
                        }
                        break;
                }
                break;
            case "tag":
                for (let index = 0; index < users.USERS.length; index++) {
                    if (users.USERS[index].USER_ID === args[0].options[0].value) {
                        ind = index;
                        email = users.USERS[index].EMAIL;
                        name = users.USERS[index].NICKNAME;
                        break;
                    }
                }
                break;
        }
        bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
            content: `$**{name} email címe:** ${email}@gyermekekhaza.hu`
        }}});
    }
}
