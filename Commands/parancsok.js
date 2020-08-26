const Discord = require('discord.js');
const setup = require('../setup/setup.json');

module.exports = {
    name: 'parancsok',
    description: 'writes out the commands',
    execute(message, args){
        const randomColour = Math.floor(Math.random() * 0xffffff+1);
        const Embed = new Discord.MessageEmbed()
        .setTitle('A parancsok, amiket tudsz használni:')
        .setDescription('**gyh!random** - random kiválaszt a gép egy személyt az osztályból\n**gyh!csapat #** - a gép kisorsolja a csapatokat annyi felé, amennyit a *#* helyére írsz be')
        .setColor(randomColour);
        message.channel.send(Embed);
    }
}