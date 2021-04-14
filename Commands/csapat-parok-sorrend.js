const Discord = require('discord.js');

module.exports = {
    name: 'csapat-parok-sorrend',
    description: 'makes teams, pairs or an order',
    admin : false,
    roles : [],
    guilds : [],
    execute(interaction, args, database, users, bot, command) {
        let namesLength;
        let names = [];
        let number;
        let type;
        let typePrint;
        let group;
        let nl;
        switch (command) {
            case "csapat":
                type = " csapat";
                typePrint = "csapatok"
                group = args[1];
                nl = 2;
                break;
            case "parok":
                type = " pár";
                typePrint = "párok"
                if (args) group = args[0];
                nl = 1;
                break;
            case "sorrend":
                type = "";
                typePrint = "sorrend"
                if (args) group = args[0];
                nl = 1;
                break;
        }
        users = [...users.USERS];
        let class_members = [];

        users.forEach(u => {
            if (u.REAL) class_members.push(u);
        });
        if (group) {
            switch (group.value) {
                case "sárgák":
                    class_members.forEach(c => {
                        if(c.SUBJECTS.GROUPS === 1){names.push(c.NICKNAME);}
                    });
                    break;
                case "lilák":
                    class_members.forEach(c => {
                        if(c.SUBJECTS.GROUPS === 2){names.push(c.NICKNAME);}
                    });
                    break;
                case "német":
                    class_members.forEach(c => {
                        if(c.SUBJECTS.LANGUAGE === "G"){names.push(c.NICKNAME);}
                    });
                    break;
                case "francia":
                    class_members.forEach(c => {
                        if(c.SUBJECTS.LANGUAGE === "F"){names.push(c.NICKNAME);}
                    });
                    break;
                case "tesi fiúk":
                    names = [...database.GYHG2020.BOYS];
                    console.log(names);
                    class_members.forEach(c => {
                        if(c.GENDER === "M"){names.push(c.NICKNAME);}
                    });
                    console.log(names);
                    break;
                case "tesi lányok":
                    names = [...database.GYHG2020.GIRLS];
                    console.log(names);
                    class_members.forEach(c => {
                        if(c.GENDER === "F"){names.push(c.NICKNAME);}
                    });
                    console.log(names);
                    break;
            }
        } else {
            class_members.forEach(c => {
                names.push(c.NICKNAME);
            });
        }
        switch (command) {
            case "csapat":
                number = args[0].value;
                break;
            case "parok":
                number = Math.floor(names.length / 2);
                break;
            case "sorrend":
                number = names.length;
                break;
        }
        console.log(Math.floor(names.length / 2));
        console.log(names.length)
        namesLength = names.length;
        if(number > 0 && number <= namesLength){

            /*for (let i = 0; i < database.names.length; i++) {
                names.push(database.names[i]);
            }*/
            let cycle = namesLength;
            let teams = [];
            let left;
            for (let index2 = 0; index2 < number; index2++) {
                teams.push(new Array);
                teams[index2].push(`**${index2+1}.${type}:** `);
                //teams[0] = index2+1 + ". csapat: ";
                for (let index3 = 1; index3 < Math.floor(cycle/number)+1; index3++) {
                    let randomIndex = Math.floor(Math.random()*names.length)
                    const randomElement = names[randomIndex];
                    const index = names.indexOf(randomIndex);
                    /*if (index > -1) {
                        array.splice(index, 1);
                    }*/
                    //names.splice(names.indexOf(index), 1 );
                    names.splice(randomIndex, 1);
                    teams[index2].push(randomElement);
                }
            }
            switch (command) {
                case "csapat":
                    let used = Math.floor(cycle/number)*number;
                    for (let index5 = 0; index5 < cycle-used; index5++) {
                        let randomIndex = Math.floor(Math.random()*names.length)
                        const randomElement = names[randomIndex];
                        teams[index5].push(randomElement);
                    }
                    break;
                case "parok":
                    if (names.length === 1) {
                        left = names[0];
                    }
                    break;

            }
            //teams[Array] = teams[Array].join(", ");
            for (let index6 = 0; index6 < number; index6++) {
                teams[index6] = teams[index6].join(", ").replace(":** , ", ":** ");
            }
            const Embed = new Discord.MessageEmbed()
            .setTitle(`A ${typePrint}${group ? ` ehhez: ${group.value}` : ""}:`)
            .setDescription(`${teams.join("\n".repeat(nl))}${left ? `${"\\n".repeat(nl)}**Kimaradt:** ${left}` : ""}`)
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

