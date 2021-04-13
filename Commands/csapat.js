const Discord = require('discord.js');

module.exports = {
    name: 'csapat',
    description: 'makes teams',
    admin : false,
    roles : [],
    guilds : [],
    execute(interaction, args, database, users, bot, command) {
        let classLength;
        let names = [];
        let number;
        let type;
        let group;
        switch (command) {
            case "csapat":
                type = "csapat";
                group = args[1];
                break;
            case "parok":
                type = "pár";
                if (args) group = args[0];
                break;
        }
        users = users.USERS;
        let class_members = [];

        for (let i = 0; i < users.length; i++) {
            if (users[i].REAL) class_members.push(users[i]);
        }
        if (group) {
            switch (group.value) {
                case "sárgák":
                    for (let i = 0; i < class_members.length; ++i) {
                        if(class_members[i].SUBJECTS.GROUPS === 1){names.push(class_members[i]);}
                    }
                    break;
                case "lilák":
                    for (let i = 0; i < class_members.length; ++i) {
                        if(class_members[i].SUBJECTS.GROUPS === 2){names.push(class_members[i]);}
                    }
                    break;
                case "német":
                    for (let i = 0; i < class_members.length; ++i) {
                        if(class_members[i].SUBJECTS.LANGUAGE === "G"){names.push(class_members[i]);}
                    }
                    break;
                case "francia":
                    for (let i = 0; i < class_members.length; ++i) {
                        if(class_members[i].SUBJECTS.LANGUAGE === "F"){names.push(class_members[i]);}
                    }
                    break;
                case "tesi fiúk":
                    names = database.GYHG2020.BOYS;
                    for (let i = 0; i < class_members.length; ++i) {
                        if(class_members[i].GENDER === "M"){names.push(class_members[i].NICKNAME);}
                    }
                    break;
                case "tesi lányok":
                    names = database.GYHG2020.GIRLS;
                    for (let i = 0; i < class_members.length; ++i) {
                        if(class_members[i].GENDER === "F"){names.push(class_members[i].NICKNAME);}
                    }
                    break;
            }
            class_members = names;
        }
        switch (command) {
            case "csapat":
                number = args[0].value;
                break;
            case "parok":
                number = Math.floor(class_members.length / 2);
                break;
        }
        console.log(Math.floor(class_members.length / 2));
        console.log(class_members.length)
        classLength = class_members.length;
        if(number > 0 && number <= classLength){

            /*for (let i = 0; i < database.CLASS_MEMBERS.length; i++) {
                class_members.push(database.CLASS_MEMBERS[i]);
            }*/
            let cycle = classLength;
            let teams = [];
            let left;
            for (let index2 = 0; index2 < number; index2++) {
                teams.push(new Array);
                teams[index2].push(`**${index2+1}. ${type}:** `);
                //teams[0] = index2+1 + ". csapat: ";
                for (let index3 = 1; index3 < Math.floor(cycle/number)+1; index3++) {
                    let randomIndex = Math.floor(Math.random()*class_members.length)
                    const randomElement = class_members[randomIndex];
                    const index = class_members.indexOf(randomIndex);
                    /*if (index > -1) {
                        array.splice(index, 1);
                    }*/
                    //class_members.splice(class_members.indexOf(index), 1 );
                    class_members.splice(randomIndex, 1);
                    teams[index2].push(group && (group.value === "tesi fiúk" || group.value === "tesi lányok") ?  randomElement : randomElement.NICKNAME);
                }
            }
            switch (command) {
                case "csapat":
                    let used = Math.floor(cycle/number)*number;
                    for (let index5 = 0; index5 < cycle-used; index5++) {
                        let randomIndex = Math.floor(Math.random()*class_members.length)
                        const randomElement = class_members[randomIndex];
                        teams[index5].push(group && (group === "tesi fiúk" || group.value === "tesi lányok") ?  randomElement : randomElement.NICKNAME);
                    }
                    break;
                case "parok":
                    if (class_members.length === 1) {
                        left = class_members[0];
                    }
                    break;

            }
            //teams[Array] = teams[Array].join(", ");
            for (let index6 = 0; index6 < number; index6++) {
                teams[index6] = teams[index6].join(", ").replace(":** , ", ":** ");
            }
            const Embed = new Discord.MessageEmbed()
            .setTitle(`A ${type}ok${group ? ` ehhez: ${group.value}` : ""}:`)
            .setDescription(`${teams.join("\n\n")}${left ? `\n\n**Kimaradt:** ${left}` : ""}`)
            .setColor("RANDOM");
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
                embeds: [Embed]
            }}});
        } else {
            bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
                content: "Érvénytelen paraméter!"
            }}});
        }
    }
}

