const Discord = require('discord.js');
let class_members;
let classLength;
let number;
module.exports = {
    name: 'csapat',
    description: 'makes teams',
    execute(message, args, database){
        console.log(args[0]);
        console.log(args[1]);
        console.log(args[2]);
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
                class_members = [...database.CLASS_MEMBERS];
                number = args[1];
                break;
        }
        classLength = class_members.length;
        console.log(number > 0 && number <= classLength);
        console.log(classLength);
        if(number > 0 && number <= classLength){
            console.log(args);

            /*for (let i = 0; i < database.CLASS_MEMBERS.length; i++) {
                class_members.push(database.CLASS_MEMBERS[i]);
            }*/
            var cycle = classLength;
            var teams = [];
            for (let index2 = 0; index2 < number; index2++) {
                teams.push(new Array);
                teams[index2].push(`**${index2+1}. csapat:** `);
                //teams[0] = index2+1 + ". csapat: ";
                for (let index3 = 1; index3 < Math.floor(cycle/number)+1; index3++) {
                    console.log(class_members);
                    console.log(database);
                    console.log(teams);
                    console.log(index2);
                    console.log(index3);
                    var randomIndex = Math.floor(Math.random()*class_members.length)
                    const randomElement = class_members[randomIndex];
                    const index = class_members.indexOf(randomIndex);
                    /*if (index > -1) {
                        array.splice(index, 1);
                    }*/
                    //class_members.splice(class_members.indexOf(index), 1 );
                    class_members.splice(randomIndex, 1);
                    teams[index2].push(randomElement);
                }
            }
            var used = Math.floor(cycle/number)*number;
            for (let index5 = 0; index5 < cycle-used; index5++) {
                teams[index5].push(class_members[index5]);

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
            console.log(class_members);
        } else {
            message.channel.send("Érvénytelen paraméter!");
        }
    }
}