const Discord = require('discord.js');

module.exports = {
    name: 'csapat',
    description: 'makes teams',
    admin : false,
    roles : [],
    guilds : [],
    execute(interaction, args, database, users, bot) {
        let classLength;
        let names = [];
        let number = args[0].value;
        users = users.USERS;
        let class_members = [];

        for (let i = 0; i < users.length; i++) {
            if (users[i].REAL) class_members.push(users[i]);
        }
        if (args[1]) {
            switch (args[1].value) {
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
                    names = database.PE.BOYS;
                    break;
                case "tesi lányok":
                    names = database.PE.GIRLS;
            }
            class_members = names;
        }
        console.log(class_members);
        classLength = class_members.length;
        if(number > 0 && number <= classLength){

            /*for (let i = 0; i < database.CLASS_MEMBERS.length; i++) {
                class_members.push(database.CLASS_MEMBERS[i]);
            }*/
            let cycle = classLength;
            let teams = [];
            for (let index2 = 0; index2 < number; index2++) {
                teams.push(new Array);
                teams[index2].push(`**${index2+1}. csapat:** `);
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
                    teams[index2].push(args[1] && (args[1].value === "tesi fiúk" || args[1].value === "tesi lányok") ?  randomElement : randomElement.NICKNAME);
                }
            }
            let used = Math.floor(cycle/number)*number;
            for (let index5 = 0; index5 < cycle-used; index5++) {
                teams[index5].push(args[1] && (args[1] === "tesi fiúk" || args[1].value === "tesi lányok") ?  class_members[index5] : class_members[index5].NICKNAME);

            }
            //teams[Array] = teams[Array].join(", ");
            for (let index6 = 0; index6 < number; index6++) {
                teams[index6] = teams[index6].join(", ").replace(":** , ", ":** ");
            }
            const Embed = new Discord.MessageEmbed()
            .setTitle('A csapatok:')
            .setDescription(`${teams.join("\n\n")}`)
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