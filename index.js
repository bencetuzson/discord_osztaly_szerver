console.log("Starting up...")
const Discord = require('discord.js');
//const Welcome = require("discord-welcome");
const bot = new Discord.Client({
	partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
const setup = require('./setup/setup.json');
const config = require(setup.TOKEN_PATH);
const fs = require('fs');
const rang = require('./Commands/rang.js');
(async () => {
    //...
  })()
const prefix = setup.PREFIX;
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(setup.COMMANDS_PATH).filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(setup.COMMANDS_PATH + file);
    bot.commands.set(command.name, command);
};
bot.on('ready', ()=>{
    console.log(bot.user.tag + ' bot is active')
    bot.user.setActivity(setup.STATUS, {type: setup.ACTIVITY});
})

bot.on('message', async message => {
    if (message.author.bot){return};
    let args = message.content.substring(' ').split(' ');

    switch (args[0].toLowerCase()) {
        case `${prefix}szia`:
            bot.commands.get('szia').execute(message, args);
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
        case `${prefix}csapat`:
            bot.commands.get('csapat').execute(message, args);
            break;
        case `${prefix}parancsok`:
            bot.commands.get('parancsok').execute(message, args);
            break;
        case `${prefix}rang`:
            bot.commands.get('rang').execute(await message, args);
            break;
    }
})

bot.on('messageReactionAdd', async (reaction, user) => {
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();

    if(user.bot) return;
    if(!reaction.message.guild) return;
    console.log(reaction.message.channel.id);
    if(reaction.message.channel.id == 641663554608431138) {
        console.log('success');
        for (let index = 0; index < setup.CATEGORIES.length; index++) {
            console.log(rang.reactionArr);
           if (reaction.emoji.name == rang.reactionArr[index]) {
               console.log(member.guild.roles.get(rang.roleArr[index]));
            await reaction.message.guild.members.chache.get(user.id).roles.add(member.guild.roles.get(rang.roleArr[index]));
            } 
        }
        
    }
});

/*bot.on('guildMemberAdd', (message, member) => {
    //const user = bot.users.cache.get(member);
    console.log(member);
    //console.log(message);
    bot.users.get(member).send(`
        Szia, ${member}!\n
        Üdvözöllek a **${message.server.name}en**! A moderátorokat már értesítettük az érkezésedről, már csak arra kell várni, hogy beállítsák a rangjaidat...
    `); 
});*/

/*bot.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`
        Szia, ${member}!\n
        Üdvözöllek a **${message.server.name}en**! A moderátorokat már értesítettük az érkezésedről, már csak arra kell várni, hogy beállítsák a rangjaidat...
    `);
  });*/

/*bot.on("guildCreate", guild => {
    guild.owner.send('');
});*/
/*Welcome(bot, {
    privatemsg : "",
    publicmsg : "null",
    publicchannel : 633766572837699584
});*/
bot.on('guildMemberAdd', member => {
    const raw = setup.WELCOME_MESSAGE;
    console.log(raw);
    const msg = raw.replace(setup.USER_NAME, `${member.user}`).replace(setup.SERVER_NAME, `${member.guild.name}`);
    member.send(msg);
});

bot.login(config.TOKEN);