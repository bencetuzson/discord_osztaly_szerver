const Discord = require('discord.js');

module.exports = {
    name: 'rang',
    description: 'reaction roles',
    admin : true,
    roles : [],
    guilds : [],
    async execute(message, args){
        let categoryArr = [];
        let reactionArr = [];
        let roleArr = [];
        function charDel(string) {
            return string.substing(1, string.length);
        }

        function roles() {
            let i = 0;
            for (const [key, value] of Object.entries(setup.CATEGORIES)){
                categoryArr[i++] = `${JSON.stringify(value).substring(1, JSON.stringify(value).length-1)} - ${JSON.stringify(key).substring(1, JSON.stringify(key).length-1)}`;
                //console.log(i);
                //console.log(categoryArr);
            }
            return categoryArr.join('\n\n')
        }

        let j = 0;
        for (const [key, value] of Object.entries(setup.CATEGORIES)){
            reactionArr[j++] = JSON.stringify(value).substring(1, JSON.stringify(value).length-1);
            console.log(j);
            console.log(reactionArr);
        }

        let k = 0;
        for (const [key, value] of Object.entries(setup.CATEGORIES)){
            roleArr[k++] = JSON.stringify(key).substring(1, JSON.stringify(key).length-1);
            console.log(k);
            console.log(roleArr);
        }
        
        console.log(categoryArr);
        const randomColour = Math.floor(Math.random() * 0xffffff+1);
        const embed = new Discord.MessageEmbed()
        .setTitle('Milyen kategóriák érdekelnek?')
        .setDescription(`**Kattints arra az emojira a kocka alatt, ami azt a kategóriát takarja, ami téged érdekel. Ha esetleg már nem érdekel egy kategória, csak nyomd meg mégegyszer azt a kategóriát szimbolizáló gombot!**\n\n${roles()}`)
        .setColor(randomColour);
        let msgEmbed = await message.channel.send(embed);
        console.log(msgEmbed);
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        console.log(msgEmbed.id);

        for (let index = 0; index < reactionArr.length; index++) {
            console.log(index);
            msgEmbed.react(reactionArr[index]);
            //.then(console.log)
            //.catch(console.error);
        }
    }
}