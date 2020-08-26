const Discord = require('discord.js');
const setup = require('../setup/setup.json');

module.exports = {
    name: 'csapat',
    description: 'makes teams',
    execute(message, args){
        console.log(args);
        var class_members = setup.CLASS_MEMBERS
        var cycle = class_members.length;
        var teams = [];
        for (let index2 = 0; index2 < args[1]; index2++) {
            teams.push(new Array);
            teams[index2].push(`**${index2+1}. csapat:** `);
            //teams[0] = index2+1 + ". csapat: ";
            for (let index3 = 1; index3 < Math.floor(cycle/args[1])+1; index3++) {
                console.log(class_members);
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
        var used = Math.floor(cycle/args[1])*args[1];
        for (let index5 = 0; index5 < cycle-used; index5++) {
            teams[index5].push(class_members[index5]);
            
        }
        //teams[Array] = teams[Array].join(", ");
        for (let index6 = 0; index6 < args[1]; index6++) {
            teams[index6] = teams[index6].join(", ").replace(":** , ", ":** ");
        }
        const randomColour = Math.floor(Math.random() * 0xffffff+1);
        const Embed = new Discord.MessageEmbed()
        .setTitle('A csapatok:')
        .setDescription(`${teams.join("\n\n")}`)
        .setColor(randomColour);
        message.channel.send(Embed);
        console.log(class_members);
    }
}