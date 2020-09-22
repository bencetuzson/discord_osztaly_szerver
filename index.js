console.log("Starting up...");

const Discord = require('discord.js');
const bot = new Discord.Client({
	partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
const setup = require('../database/setup.json');
const token = require(setup.CONFIG_PATH).MAIN.TOKEN;
const config = require(setup.CONFIG_PATH);
const users = require(setup.USERS_PATH);
const fs = require('fs');
const { set } = require('mongoose');
const { userInfo } = require('os');
let remoteMsg;
(async () => {
    //...
  })()
const prefix = require(setup.CONFIG_PATH).MAIN.PREFIX;
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
    return args.content.toLowerCase();
}

function noPrefix(message, args) {
    return message.content.toLowerCase().includes(args);
}

function genderSearch(reaction, user) {
    for (let index = 0; index < users.USERS.length; index++) {
        if (users.USERS[index].USER_ID === user.id) {
            if(users.USERS[index].GENDER === "M") {
                return users.GENDERS_ROLE_ID.BOY;
            } else if (users.USERS[index].GENDER === "F") {
                return users.GENDERS_ROLE_ID.GIRL;
            }
        }
        
    }
}

function nicknameSearch(reaction, user) {
    for (let index = 0; index < users.USERS.length; index++) {
        if (users.USERS[index].USER_ID === user.id) {
            return users.USERS[index].NICKNAME;
        }
        
    }
}

function moderatorSearch(reaction, user) {
    for (let index = 0; index < users.USERS.length; index++) {
        if (users.USERS[index].USER_ID === user.id) {
            return users.USERS[index].MODERATOR;
        }
        
    }
}

function birthdate(year, month, day) {
    let birthdays = [];
    for (let index = 0; index < users.USERS.length; index++) {
        if (users.USERS[index].BIRTHDAY.MONTH === month && users.USERS[index].BIRTHDAY.DAY === day) {
            birthdays.push(users.USERS[index].USER_ID)
        }
        
    }
    return birthdays;
}

function age(year, month, day) {
    var ages = [];
    for (let index = 0; index < users.USERS.length; index++) {
        if (users.USERS[index].BIRTHDAY.MONTH === month && users.USERS[index].BIRTHDAY.DAY === day) {
            ages.push(year - users.USERS[index].BIRTHDAY.YEAR);
        }
        
    }
    return ages;
}

function birthday(year, month, day) {
    const BDraw = setup.BIRTHDAY_MESSAGE;
    let BDlength = birthdate(year, month, day).length;
    for (let indexBD = 0; indexBD < BDlength; indexBD++) {
        let BDdm = BDraw.replace(setup.USER_NAME, `${bot.users.cache.get(birthdate(year, month, day)[indexBD])}`).replace(setup.AGE, `${age(year, month, day)[indexBD]}`);
        let DMuser = bot.users.cache.get(birthdate(year, month, day)[indexBD]);
        DMuser.send(BDdm);
    }
}

function isInThisClass(member) {
    for (let index2 = 0; index2 < users.USERS.length; index2++) {
        if (users.USERS[index2].USER_ID === member.user.id) {
            return true;
        }
        
    }
}

function ifReacted(emojiID, msgID, msg) {
        msg.channel.messages.fetch({around: msgID, limit: 1})
        .then(message => {  
        let reactionVar = message.reactions.cache
        .find(r => r.emoji.name === emojiID);
        if (reactionVar) {
        return reactionVar
        .users.cache.array()
        .filter((u) => !u.bot)
    }});
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

bot.on('message', async (message, user) => {
    remoteMsg = message;
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
            if(message.member.hasPermission("ADMINISTRATOR")){
                bot.commands.get('rang').execute(await message, args);
            }
            break;
        case `${prefix}reakcio`:
            bot.commands.get('reakcio').execute(await message, args);
            break;
        case `${prefix}orarend`:
            bot.commands.get('orarend').execute(await message, args);
            break;
        case `${prefix}verify`:
            if(message.member.hasPermission("ADMINISTRATOR")){
                bot.commands.get('verify').execute(await message, args);
            }
            break;
        case `${prefix}modify`:
            if(message.member.hasPermission("ADMINISTRATOR")){
                bot.commands.get('modify').execute(await message, args);
            }
            break;
        case `${prefix}szulinap`:
                bot.commands.get('szulinap').execute(await message, user, users, bot, args);
            break;
        case `${prefix}szolj`:
            bot.commands.get('szolj').execute(await message, args);
            break;
        case `${prefix}jon`:
            bot.commands.get('jon').execute(await message, args, user, users);
            break;
        case `${prefix}test`:
            if(message.member.hasPermission("ADMINISTRATOR")){
                console.log(message.channel.id);
            }
            break;
    }
    if (message.member.user.id !== setup.BOT_ID/* && message.member.user.id != users.USERS.Tuzsi.USER_ID*/) {
        if(noPrefix(message, 'buzi')) {
            message.channel.send(`${message.member.user} te vagy a buzi`/*`, de ${message.guild.members.cache.get(users.USERS.Marci.USER_ID)} nagyobb`*/);
        } else if(msgLC(message) === 'sziasztok' || msgLC(message) === 'sziasztok!'){
            message.channel.send(`Szia ${message.member.user}!`);
        }
    }

    if (message.channel.id === setup.REACTION_CHANNELS.Spam.one_word_story_in_english && args.length > 1) {
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

    switch (reaction.emoji.name) {
        case setup.REACTION_ROLES.BOT.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.BOT.MESSAGE_ID) {
                if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Verified.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.BOT.ROLE_ID);
                } else if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.BOT.TEMP_ROLE_ID);
                }
            }
        break;

        case setup.REACTION_ROLES.Zene.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Zene.MESSAGE_ID) {
                if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Verified.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Zene.ROLE_ID);
                } else if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Zene.TEMP_ROLE_ID);
                }
            }
        break;

        case setup.REACTION_ROLES.Gaming.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.MESSAGE_ID) {
                if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Verified.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Gaming.ROLE_ID);
                } else if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Gaming.TEMP_ROLE_ID);
                }
            }
        break;

        case setup.REACTION_ROLES.Teszter.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Teszter.MESSAGE_ID) {
                if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Verified.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Teszter.ROLE_ID);
                } else if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Teszter.TEMP_ROLE_ID);
                }
            }
        break;

        case setup.REACTION_ROLES.Spam.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Spam.MESSAGE_ID) {
                if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Verified.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Spam.ROLE_ID);
                } else if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Spam.TEMP_ROLE_ID);
                }
            }
        break;

        case setup.REACTION_ROLES.Verified.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Verified.MESSAGE_ID) {
                if (reaction.emoji.name === setup.REACTION_ROLES.Verified.REACTION) {
                    if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Unverified.ROLE_ID)) {
                        await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID);
                    }
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Unverified.ROLE_ID);
                    try {
                        await reaction.users.remove(user.id);
                    } catch (error) {
                        console.error('Failed to remove reactions.');
                    }
                }
            }
        break;

        case setup.REACTION_ROLES.Ezek_erdekelnek.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Ezek_erdekelnek.MESSAGE_ID) {
                if (reaction.emoji.name === setup.REACTION_ROLES.Ezek_erdekelnek.REACTION) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Verified.ROLE_ID);
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID);
                    await reaction.message.guild.members.cache.get(user.id).roles.add(genderSearch(reaction, user));
                    if (moderatorSearch(reaction, user)) {
                        await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Moderator.ROLE_ID);
                    };

                    reaction.message.guild.members.cache.get(user.id).setNickname(nicknameSearch(reaction, user));

                    try {
                        await reaction.users.remove(user.id);
                    } catch (error) {
                        console.error('Failed to remove reactions.');
                    };

                    if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.BOT.TEMP_ROLE_ID)) {
                        await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.BOT.ROLE_ID);
                        await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.BOT.TEMP_ROLE_ID);
                    };

                    if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Gaming.TEMP_ROLE_ID)) {
                        await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Gaming.ROLE_ID);
                        await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Gaming.TEMP_ROLE_ID);
                    };

                    if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Zene.TEMP_ROLE_ID)) {
                        await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Zene.ROLE_ID);
                        await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Zene.TEMP_ROLE_ID);
                    };

                    if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Spam.TEMP_ROLE_ID)) {
                        await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Spam.ROLE_ID);
                        await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Spam.TEMP_ROLE_ID);
                    };

                    if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Teszter.TEMP_ROLE_ID)) {
                        await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Teszter.ROLE_ID);
                        await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Teszter.TEMP_ROLE_ID);
                    };
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

    switch (reaction.emoji.name) {
        case setup.REACTION_ROLES.BOT.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.BOT.MESSAGE_ID) {
                if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Verified.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.BOT.ROLE_ID);
                } else if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.BOT.TEMP_ROLE_ID);
                }
            }
        break;

        case setup.REACTION_ROLES.Zene.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Zene.MESSAGE_ID) {
                if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Verified.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Zene.ROLE_ID);
                } else if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Zene.TEMP_ROLE_ID);
                }
            }
        break;

        case setup.REACTION_ROLES.Gaming.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.MESSAGE_ID) {
                if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Verified.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Gaming.ROLE_ID);
                } else if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Gaming.TEMP_ROLE_ID);
                }
            }
        break;

        case setup.REACTION_ROLES.Teszter.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Teszter.MESSAGE_ID) {
                if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Verified.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Teszter.ROLE_ID);
                } else if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Teszter.TEMP_ROLE_ID);
                }
            }
        break;

        case setup.REACTION_ROLES.Spam.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Spam.MESSAGE_ID) {
                if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Verified.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Spam.ROLE_ID);
                } else if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Spam.TEMP_ROLE_ID);
                }
            }
        break;
    }
});


bot.on('guildMemberAdd', member => {
    if (isInThisClass(member)) {
        const raw = setup.WELCOME_MESSAGE;
        const dm = raw.replace(setup.USER_NAME, `${member.user}`).replace(setup.SERVER_NAME, `${member.guild.name}`);
        member.send(dm);
        member.roles.add(setup.REACTION_ROLES.Unverified.ROLE_ID);
    } else if (member.user.bot) {
        member.roles.add(setup.REACTION_ROLES.BOT.ROLE_ID);
    } else {
        const raw = setup.NOT_IN_THIS_CLASS_MESSAGE;
        const dm = raw.replace(setup.USER_NAME, `${member.user}`).replace(setup.SERVER_NAME, `${member.guild.name}`);
        member.send(dm);
        member.kick();

    }
});

bot.on('guildMemberRemove', async member => {
    let publicmsg = setup.LEFT_PUBLIC_MESSAGE;
    let publicchannel = setup.REACTION_ROLES.Rendszeruzenetek.CHANNEL_ID;

    if (publicmsg && publicchannel) {
        let channel = member.guild.channels.cache.find(val => val.name === publicchannel) || member.guild.channels.cache.get(publicchannel);
        if (!channel) {
          console.log(`Channel "${publicchannel}" not found`);
        } else {
          if (channel.permissionsFor(bot.user).has('SEND_MESSAGES')) {
            if (typeof publicmsg === "object") {
              channel.send({
                publicmsg
              });
            } else {
              let msg = publicmsg.replace(setup.USER_NAME, `${member.user}`).replace(setup.SERVER_NAME, `${member.guild.name}`);
              channel.send(msg);
            }
        }
        }
    }
    //if (member.user.bot) return;
    //const raw2 = setup.LEFT_DM;
    //const dm2 = raw2.replace(setup.USER_NAME, `${member.user}`).replace(setup.SERVER_NAME, `${member.guild.name}`);
    //member.send(dm2);

});

var now = new Date();
var ms = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 30, 0, 0) - now;
if (ms < 0) {
     ms += 86400000;
}


setTimeout(function(){birthday(now.getFullYear(), now.getMonth()+1, now.getDate())}, ms);

bot.login(token);