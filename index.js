console.log("Starting up...")
const Discord = require('discord.js');
//const Welcome = require("discord-welcome");
const bot = new Discord.Client({
	partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
const setup = require('./setup/setup.json');
const config = require(setup.TOKEN_PATH);
const fs = require('fs');

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

function msgLC(args){
    msgArgs = args;
    //console.log(args.content.toLowerCase());
    return args.content.toLowerCase();
}

function noPrefix(message, args) {
    return message.content.toLowerCase().includes(args);
}
//console.log(setup.GENDER_ROLES.length);
//,console.log(setup.GENDER_ROLES[0].USER_ID);

function genderSearch(reaction, user) {
    for (let index = 0; index < setup.GENDER_ROLES.length; index++) {
        //console.log(user.id);
        //console.log(setup.GENDER_ROLES[index].USER_ID);
        if (setup.GENDER_ROLES[index].USER_ID == user.id) {
            return setup.GENDER_ROLES[index].ROLE_ID;
        }
        
    }
}

function isInThisClass(member) {
    for (let index2 = 0; index2 < setup.GENDER_ROLES.length; index2++) {
        if (setup.GENDER_ROLES[index2].USER_ID == member.user.id) {
            return true;
        }
        
    }
}

bot.on('message', async (message, user) => {
    if (message.author.bot){return};
    let args = message.content.substring(' ').split(' ');

    switch (args[0].toLowerCase()) {
        case `${prefix}ping`:
            bot.commands.get('ping').execute(await message, args);
            break;
        case `${prefix}colour`:
            bot.commands.get('colour').execute(await message, args);
            break;
        case `${prefix}random`:
            bot.commands.get('random').execute(message, args);
            break;
        case `${prefix}csapat`:
            bot.commands.get('csapat').execute(await message, args);
            break;
        case `${prefix}parancsok`:
            bot.commands.get('parancsok').execute(message, args);
            break;
        case `${prefix}rang`:
            bot.commands.get('rang').execute(await message, args);
            break;
        case `${prefix}reakcio`:
            bot.commands.get('reakcio').execute(await message, args);
            break;
        case `${prefix}orarend`:
            bot.commands.get('orarend').execute(await message, args);
            break;
        case `${prefix}verify`:
            bot.commands.get('verify').execute(await message, args);
            break;
        case `${prefix}modify`:
            bot.commands.get('modify').execute(await message, args);
            break;
        case `${prefix}test`:
            console.log(message.channel.id);
            break;
    }
    if (message.member.user.id != setup.BOT_ID/* && message.member.user.id != setup.GENDER_ROLES.Tuzsi.USER_ID*/) {
        if(noPrefix(message, 'buzi')) {
            message.channel.send(`${message.member.user} te vagy a buzi`/*`, de ${message.guild.members.cache.get(setup.GENDER_ROLES.Marci.USER_ID)} nagyobb`*/);
        } else if(msgLC(message) == 'sziasztok'){
            message.channel.send(`Szia ${message.member.user}!`);
        }
    }

    if (message.channel.id == setup.REACTION_CHANNELS.Spam.one_word_story_in_english && args.length > 1) {
        await message.channel.messages.fetch({ limit: 1 }).then(messages => {
            message.channel.bulkDelete(messages);
        });
    }
})

bot.on('messageReactionAdd', async (reaction, user) => {
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();

    if(user.bot) return;
    if(!reaction.message.guild) return;

    console.log(reaction.emoji.name);
    console.log(setup.REACTION_ROLES.BOT.MESSAGE_ID);
    console.log(setup.REACTION_ROLES.BOT.REACTION);
    console.log(setup.REACTION_ROLES.BOT.ROLE_ID);
    console.log(reaction.message.id);
    console.log(user.id);  

    switch (reaction.emoji.name) {
        case setup.REACTION_ROLES.BOT.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.BOT.MESSAGE_ID) {
                console.log("success");
                if (reaction.emoji.name === setup.REACTION_ROLES.BOT.REACTION) {
                    console.log("success2");
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.BOT.ROLE_ID);
                    
                }
            }
        break;

        case setup.REACTION_ROLES.Zene.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Zene.MESSAGE_ID) {
                console.log("success");
                if (reaction.emoji.name === setup.REACTION_ROLES.Zene.REACTION) {
                    console.log("success2");
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Zene.ROLE_ID);
                    
                }
            }
        break;

        case setup.REACTION_ROLES.Gaming.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.MESSAGE_ID) {
                console.log("success");
                if (reaction.emoji.name === setup.REACTION_ROLES.Gaming.REACTION) {
                    console.log("success2");
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Gaming.ROLE_ID);
                    
                }
            }
        break;

        case setup.REACTION_ROLES.Teszter.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Teszter.MESSAGE_ID) {
                console.log("success");
                if (reaction.emoji.name === setup.REACTION_ROLES.Teszter.REACTION) {
                    console.log("success2");
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Teszter.ROLE_ID);
                    
                }
            }
        break;

        case setup.REACTION_ROLES.Verified.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Verified.MESSAGE_ID) {
                console.log("success");
                if (reaction.emoji.name === setup.REACTION_ROLES.Verified.REACTION) {
                    console.log("success2");
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID);
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Unverified.ROLE_ID);

                    
                }
            }
        break;

        case setup.REACTION_ROLES.Spam.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Spam.MESSAGE_ID) {
                console.log("success");
                if (reaction.emoji.name === setup.REACTION_ROLES.Spam.REACTION) {
                    console.log("success2");
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Spam.ROLE_ID);
                    
                }
            }
        break;

        case setup.REACTION_ROLES.Ezek_erdekelnek.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Ezek_erdekelnek.MESSAGE_ID) {
                console.log("success");
                if (reaction.emoji.name === setup.REACTION_ROLES.Ezek_erdekelnek.REACTION) {
                    console.log("success2 " + user);
                    console.log(reaction.message.guild.members.cache.get(user.id));
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Verified.ROLE_ID);
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID);
                    reaction.message.guild.members.cache.get(user.id).roles.add(genderSearch(reaction, user));
                    
                }
            }
        break;

        default:
            break;
    }
});

bot.on('messageReactionRemove', async (reaction, user) => {
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();

    if(user.bot) return;
    if(!reaction.message.guild) return;

    console.log(reaction.emoji.name);
    console.log(setup.REACTION_ROLES.BOT.MESSAGE_ID);
    console.log(setup.REACTION_ROLES.BOT.REACTION);
    console.log(setup.REACTION_ROLES.BOT.ROLE_ID);
    console.log(reaction.message.id);
    console.log(user.id);  

    switch (reaction.emoji.name) {
        case setup.REACTION_ROLES.BOT.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.BOT.MESSAGE_ID) {
                console.log("success");
                if (reaction.emoji.name === setup.REACTION_ROLES.BOT.REACTION) {
                    console.log("success2");
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.BOT.ROLE_ID);
                    
                }
            }
        break;

        case setup.REACTION_ROLES.Zene.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Zene.MESSAGE_ID) {
                console.log("success");
                if (reaction.emoji.name === setup.REACTION_ROLES.Zene.REACTION) {
                    console.log("success2");
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Zene.ROLE_ID);
                    
                }
            }
        break;

        case setup.REACTION_ROLES.Gaming.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.MESSAGE_ID) {
                console.log("success");
                if (reaction.emoji.name === setup.REACTION_ROLES.Gaming.REACTION) {
                    console.log("success2");
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Gaming.ROLE_ID);
                    
                }
            }
        break;

        case setup.REACTION_ROLES.Teszter.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Teszter.MESSAGE_ID) {
                console.log("success");
                if (reaction.emoji.name === setup.REACTION_ROLES.Teszter.REACTION) {
                    console.log("success2");
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Teszter.ROLE_ID);
                    
                }
            }
        break;

        case setup.REACTION_ROLES.Spam.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Spam.MESSAGE_ID) {
                console.log("success");
                if (reaction.emoji.name === setup.REACTION_ROLES.Spam.REACTION) {
                    console.log("success2");
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Spam.ROLE_ID);
                    
                }
            }
        break;
    }
});


bot.on('guildMemberAdd', member => {
    if (isInThisClass(member)) {
        const raw = setup.WELCOME_MESSAGE;
        const msg = raw.replace(setup.USER_NAME, `${member.user}`).replace(setup.SERVER_NAME, `${member.guild.name}`);
        member.send(msg);
        member.roles.add(setup.REACTION_ROLES.Unverified.ROLE_ID);
    } else if (member.user.bot) {
        member.roles.add(setup.REACTION_ROLES.BOT.ROLE_ID);
    } else {
        const raw = setup.NOT_IN_THIS_CLASS_MESSAGE;
        const msg = raw.replace(setup.USER_NAME, `${member.user}`).replace(setup.SERVER_NAME, `${member.guild.name}`);
        member.send(msg);
        member.kick();

    }
});

bot.login(config.TOKEN);