const Discord = require('discord.js');
const setup = require('../setup/setup.json');

module.exports = {
    name: 'parancsok',
    description: 'writes out the commands',
    execute(message, args){
        const randomColour = Math.floor(Math.random() * 0xffffff+1);
        const Embed = new Discord.MessageEmbed()
        .setTitle('A parancsok, amiket tudsz használni:')
        .setDescription('**gyh!random** - Random kiválaszt a gép egy személyt az osztályból\n**gyh!csapat [csapatok száma]** - A gép kisorsolja a csapatokat annyi felé, amennyit a *[csapatok száma]* helyére írsz be\n**gyh!orarend** - Kiírja az aktuális órarendet')
        .setColor(randomColour);
        message.channel.send(Embed);
    }
}