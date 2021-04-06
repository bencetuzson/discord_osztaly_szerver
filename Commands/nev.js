const Discord = require('discord.js');

module.exports = {
    name: 'nev',
    description: 'changes the author\'s personal role\'s colour',
    admin : false,
    roles : [],
    guilds : [],
    execute(interaction, args, users, bot) {
        let names = [];
        let ind;
        for (ind = 0; ind < users.USERS.length; ++ind) {
            if(users.USERS[ind].REAL){names.push({"NICKNAME" : users.USERS[ind].NICKNAME, "FIRSTNAME" : users.USERS[ind].FIRSTNAME, "LASTNAME" : users.USERS[ind].LASTNAME});}
        }
        const sortedNames = names.sort(function (a, b) {
            let nameA;
            let nameB;
            let nameC;
            let nameD;
            switch (args[0].value) {
                case "becenév":
                    nameA = a.NICKNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    nameB = b.NICKNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    if (nameA < nameB) { return -1; } if (nameA > nameB) { return 1; } return 0;
                case "vezetéknév":
                    nameA = a.FIRSTNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    nameB = b.FIRSTNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    nameC = a.LASTNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    nameD = b.LASTNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    if (nameA < nameB) { return -1; } if (nameA > nameB) { return 1; } if (nameC < nameD) { return -1; } if (nameC > nameD) { return 1; } return 0;
                case "keresztnév":
                    nameA = a.LASTNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    nameB = b.LASTNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    nameC = a.FIRSTNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    nameD = b.FIRSTNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    if (nameA < nameB) { return -1; } if (nameA > nameB) { return 1; } if (nameC < nameD) { return -1; } if (nameC > nameD) { return 1; } return 0;
            }})

            let namesString = "";
            for (ind = 0; ind < sortedNames.length; ++ind) {
                namesString += `**${ind+1}**: ${sortedNames[ind].FIRSTNAME} ${sortedNames[ind].LASTNAME} *"${sortedNames[ind].NICKNAME}"*\n`;
            }
            const Embed = new Discord.MessageEmbed()
                .setTitle(`Névsor ${args[0].value} szerint rendezve`)
                .setDescription(namesString)
                .setColor('RANDOM');
            console.log(namesString);
        bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
            embeds: [Embed]
        }}});
    }
}