const Discord = require('discord.js');

module.exports = {
    name: 'csapat',
    description: 'makes teams',
    execute(message, args){
        console.log(args);
        var class_members = ["Fófi", "Nelly", "Gery", "Rozi", "Encsi", "Eszti", "Benedek", "Zoé", "Andriska", "Berci", "Matyi", "Ambi", "Gandi", "Liliána", "Luca", "Frédi", "Áron", "Lilko", "Adri", "Zoli", "Soki", "Adél", "Csöcsi", "Bendi", "Tuzsi", "Marci", "Panka", "Mesi"];
        var cycle = class_members.length;
        var teams = [];
        for (let index2 = 0; index2 < args[1]; index2++) {
            teams.push(new Array);
            for (let index3 = 0; index3 < Math.floor(cycle/args[1]); index3++) {
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
            teams[index5].push(class_members[index5])
            
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