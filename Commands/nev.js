const Discord = require('discord.js');

module.exports = {
    name: 'nev',
    description: 'changes the author\'s personal role\'s colour',
    execute(message, args, users) {
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
            switch(args[1]){
                case "bn":
                    nameA = a.NICKNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    nameB = b.NICKNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    if (nameA < nameB) { return -1; } if (nameA > nameB) { return 1; } return 0;
                case "vn":
                    nameA = a.FIRSTNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    nameB = b.FIRSTNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    nameC = a.LASTNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    nameD = b.LASTNAME.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    if (nameA < nameB) { return -1; } if (nameA > nameB) { return 1; } if (nameC < nameD) { return -1; } if (nameC > nameD) { return 1; } return 0;
                case "kn":
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
                .setTitle("Névsor")
                .addField(`${sortBy()} szerint rendezve`, namesString)
                .setColor('RANDOM');
            message.channel.send(Embed);

        function sortBy() {
            switch(args[1]) {
                case "bn":
                    return "Becenév";
                case "vn":
                    return "Vezetéknév";
                case "kn":
                    return "Keresztnév";
            }
        }

    }
}