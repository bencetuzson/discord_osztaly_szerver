const Discord = require('discord.js');
const bot = new Discord.Client({
	partials: ['MESSAGE']
});
const config = require('./config/config.json');
const fs = require('fs');
const prefix = 'gyh!';
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./Commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./Commands/${file}`);
    bot.commands.set(command.name, command);
};
bot.on('ready', ()=>{
    console.log(bot.user.tag + ' bot is active')
    bot.user.setActivity('Itta segiccség gyálákik', {type: "LISTENING"});
})

bot.on('message', message => {
    if (message.author.bot){return};
    let args =message.content.substring(' ').split(' ');

    switch (args[0].toLowerCase()) {
        case `${prefix}hello`:
            bot.commands.get('hello').execute(message, args);
            break;
        case `${prefix}ping`:
            bot.commands.get('ping').execute(message, args);
            break;
        case `${prefix}colour`:
            bot.commands.get('colour').execute(message, args);
            break;
        case `${prefix}random`:
            bot.commands.get('random').execute(message, args);
            break;
    }
})

bot.login(config.TOKEN);