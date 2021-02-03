const Discord = require('discord.js');
let class_members;
let classLength;
let number;
let tag = false;
let rang = false;
module.exports = {
    name: 'csapat',
    description: 'makes teams',
    admin : false,
    roles : [],
    guilds : [],
    execute(message, args, database, users) {
        switch (args[1]) {
            case "tesi":
                switch (args[2]) {
                    case "f":
                        class_members = [...database.PE.BOYS];
                        number = args[3];
                        break;
                    case "l":
                        class_members = [...database.PE.GIRLS];
                        number = args[3];
                        break;
                    default:
                        message.channel.send("Érvénytelen paraméter!");
                        return;
                }
                break;
            default:
                users = users.USERS;
                class_members = [];
                for (let i = 0; i < users.length; i++) {
                    if (users[i].REAL) class_members.push(users[i]);
                }
                switch (args[2]) {
                    case "tag":
                        tag = true;
                        break;
                    case "rang":
                        rang = true;
                        break;
                    case undefined:
                        break;
                    default:
                        message.channel.send("Érvénytelen paraméter!");
                        return;
                }
                number = args[1];
                break;
        }
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
                    teams[index2].push(args[1] === "tesi" ?  randomElement : (tag ? (message.guild.members.cache.get(randomElement.USER_ID) ? message.guild.members.cache.get(randomElement.USER_ID) : randomElement.NICKNAME) : (rang ? (message.guild.roles.cache.get(randomElement.ROLE_ID) ? message.guild.roles.cache.get(randomElement.ROLE_ID) : randomElement.NICKNAME) : randomElement.NICKNAME)));
                }
            }
            let used = Math.floor(cycle/number)*number;
            for (let index5 = 0; index5 < cycle-used; index5++) {
                teams[index5].push(args[1] === "tesi" ?  class_members[index5] : (tag ? (message.guild.members.cache.get(class_members[index5].USER_ID) ? message.guild.members.cache.get(class_members[index5].USER_ID) : class_members[index5].NICKNAME) : (rang ? (message.guild.roles.cache.get(randomElement.ROLE_ID) ? message.guild.roles.cache.get(randomElement.ROLE_ID) : class_members[index5].NICKNAME) : class_members[index5].NICKNAME)));

            }
            //teams[Array] = teams[Array].join(", ");
            for (let index6 = 0; index6 < number; index6++) {
                teams[index6] = teams[index6].join(", ").replace(":** , ", ":** ");
            }
            const Embed = new Discord.MessageEmbed()
            .setTitle('A csapatok:')
            .setDescription(`${teams.join("\n\n")}`)
            .setColor("RANDOM");
            message.channel.send(Embed);
        } else {
            message.channel.send("Érvénytelen paraméter!");
        }
    }
}