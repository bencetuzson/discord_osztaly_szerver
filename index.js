console.log("Starting up...");

const Discord = require('discord.js');
const Welcome = require("discord-welcome");
var schedule = require('node-schedule');
const bot = new Discord.Client({
	partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
const setup = require('./setup/setup.json');
const config = require(setup.TOKEN_PATH);
const fs = require('fs');
const { set } = require('mongoose');
const { userInfo } = require('os');
let remoteMsg;
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
            if(setup.GENDER_ROLES[index].GENDER == "M") {
                return setup.GENDERS_ROLE_ID.BOY;
            } else if (setup.GENDER_ROLES[index].GENDER = "F") {
                return setup.GENDERS_ROLE_ID.GIRL;
            }
        }
        
    }
}

function nicknameSearch(reaction, user) {
    for (let index = 0; index < setup.GENDER_ROLES.length; index++) {
        //console.log(user.id);
        //console.log(setup.GENDER_ROLES[index].USER_ID);
        if (setup.GENDER_ROLES[index].USER_ID == user.id) {
            return setup.GENDER_ROLES[index].USER_NAME;
        }
        
    }
}

function moderatorSearch(reaction, user) {
    for (let index = 0; index < setup.GENDER_ROLES.length; index++) {
        //console.log(user.id);
        //console.log(setup.GENDER_ROLES[index].USER_ID);
        if (setup.GENDER_ROLES[index].USER_ID == user.id) {
            return setup.GENDER_ROLES[index].MODERATOR;
        }
        
    }
}

function birthdate(year, month, day) {
    let birthdays = [];
    for (let index = 0; index < setup.GENDER_ROLES.length; index++) {
        //console.log(user.id);
        //console.log(setup.GENDER_ROLES[index].USER_ID);
        console.log(setup.GENDER_ROLES[index].BIRTHDAY.YEAR);
        console.log(setup.GENDER_ROLES[index].BIRTHDAY.MONTH);
        console.log(setup.GENDER_ROLES[index].BIRTHDAY.DAY);
        console.log(year);
        console.log(month);
        console.log(day);
        if (setup.GENDER_ROLES[index].BIRTHDAY.MONTH == month && setup.GENDER_ROLES[index].BIRTHDAY.DAY == day) {
            console.log("HBD");
            birthdays.push(setup.GENDER_ROLES[index].USER_ID)
        }
        
    }
    return birthdays;
}

function age(year, month, day) {
    var ages = [];
    for (let index = 0; index < setup.GENDER_ROLES.length; index++) {
        //console.log(user.id);
        //console.log(setup.GENDER_ROLES[index].USER_ID);
        if (setup.GENDER_ROLES[index].BIRTHDAY.MONTH == month && setup.GENDER_ROLES[index].BIRTHDAY.DAY == day) {
            ages.push(year - setup.GENDER_ROLES[index].BIRTHDAY.YEAR);
        }
        
    }
    return ages;
}

function birthday(year, month, day) {
    const BDraw = setup.BIRTHDAY_MESSAGE;
    console.log(birthdate(year, month, day));
    let BDlength = birthdate(year, month, day).length;
    for (let indexBD = 0; indexBD < BDlength; indexBD++) {
        let BDdm = BDraw.replace(setup.USER_NAME, `${bot.users.cache.get(birthdate(year, month, day)[indexBD])}`).replace(setup.AGE, `${age(year, month, day)[indexBD]}`);
        let DMuser = bot.users.cache.get(birthdate(year, month, day)[indexBD]);
        DMuser.send(BDdm);
    }
}
function isInThisClass(member) {
    for (let index2 = 0; index2 < setup.GENDER_ROLES.length; index2++) {
        if (setup.GENDER_ROLES[index2].USER_ID == member.user.id) {
            return true;
        }
        
    }
}

function ifReacted(emojiID, msgID, msg) {
        msg.channel.messages.fetch({around: msgID, limit: 1})
        .then(message => {  
        let reactionVar = message.reactions.cache
        .find(r => r.emoji.name == emojiID);
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
                if(user.hasP)
                bot.commands.get('verify').execute(await message, args);
            }
            break;
        case `${prefix}modify`:
            if(message.member.hasPermission("ADMINISTRATOR")){
                bot.commands.get('modify').execute(await message, args);
            }
            break;
        case `${prefix}test`:
            if(message.member.hasPermission("ADMINISTRATOR")){
                console.log(message.channel.id);
            }
            break;
    }
    if (message.member.user.id != setup.BOT_ID/* && message.member.user.id != setup.GENDER_ROLES.Tuzsi.USER_ID*/) {
        if(noPrefix(message, 'buzi')) {
            message.channel.send(`${message.member.user} te vagy a buzi`/*`, de ${message.guild.members.cache.get(setup.GENDER_ROLES.Marci.USER_ID)} nagyobb`*/);
        } else if(msgLC(message) == 'sziasztok' || msgLC(message) == 'sziasztok!'){
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
                if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Verified.ROLE_ID)) {
                    console.log("success");
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.BOT.ROLE_ID);
                } else if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.BOT.TEMP_ROLE_ID);
                }
            }
        break;

        case setup.REACTION_ROLES.Zene.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Zene.MESSAGE_ID) {
                if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Verified.ROLE_ID)) {
                    console.log("success");
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Zene.ROLE_ID);
                } else if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Zene.TEMP_ROLE_ID);
                }
            }
        break;

        case setup.REACTION_ROLES.Gaming.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.MESSAGE_ID) {
                if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Verified.ROLE_ID)) {
                    console.log("success");
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Gaming.ROLE_ID);
                } else if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Gaming.TEMP_ROLE_ID);
                }
            }
        break;

        case setup.REACTION_ROLES.Teszter.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Teszter.MESSAGE_ID) {
                if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Verified.ROLE_ID)) {
                    console.log("success");
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Teszter.ROLE_ID);
                } else if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Teszter.TEMP_ROLE_ID);
                }
            }
        break;

        case setup.REACTION_ROLES.Spam.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Spam.MESSAGE_ID) {
                if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Verified.ROLE_ID)) {
                    console.log("success");
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Spam.ROLE_ID);
                } else if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Spam.TEMP_ROLE_ID);
                }
            }
        break;

        case setup.REACTION_ROLES.Verified.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Verified.MESSAGE_ID) {
                console.log("success");
                if (reaction.emoji.name === setup.REACTION_ROLES.Verified.REACTION) {
                    console.log("success2");
                    if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Unverified.ROLE_ID)) {
                        await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID);
                    }
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Unverified.ROLE_ID);
                    const userReactions = reaction.message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
                    try {
                        //for (const reaction of userReactions.values()) {
                            await reaction.users.remove(user.id);
                        //}
                    } catch (error) {
                        console.error('Failed to remove reactions.');
                    }
                }
            }
        break;

        case setup.REACTION_ROLES.Ezek_erdekelnek.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Ezek_erdekelnek.MESSAGE_ID) {
                console.log("success");
                if (reaction.emoji.name === setup.REACTION_ROLES.Ezek_erdekelnek.REACTION) {
                    console.log("success2");
                    //console.log(reaction.message.guild.members.cache.get(user.id));
                    await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Verified.ROLE_ID);
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID);
                    await reaction.message.guild.members.cache.get(user.id).roles.add(genderSearch(reaction, user));
                    if (moderatorSearch(reaction, user)) {
                        await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Moderator.ROLE_ID);
                    }
                    reaction.message.guild.members.cache.get(user.id).setNickname(nicknameSearch(reaction, user));
                    //reaction.message.channel.messages.fetch(reaction.message.id).map(r => r).then(message => {
                    //    reaction.message.reactions.forEach(reaction => reaction.remove(user.id))
                    //  })
                    //reaction.message.reactions.forEach((reaction) => {});
                    //for (let ind = 0; ind < 4; ind++) {
                        //let reactedUser = ifReacted(setup.REACTION_ROLES.BOT.REACTION, setup.REACTION_ROLES.BOT.MESSAGE_ID, reaction.message)[ind].replace("<", "").replace("@", "").replace(">", "")
                        //if (reactedUser == user) {
                       //     await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Gaming.ROLE_ID);
                        //}
                        
                    //}
                    //console.log(reaction.message.fetch());

                    const userReactions2 = reaction.message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
                    try {
                        //for (const reaction of userReactions2.values()) {
                            //sleep(5000);
                            await reaction.users.remove(user.id);
                        //}
                    } catch (error) {
                        console.error('Failed to remove reactions.');
                    }

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




                    /*async fetch({ limit = 100, after, before } = {}); {;
                        const message = this.reaction.message;
                        const data = await this.client.api.channels[message.channel.id].messages[message.id].reactions[
                          this.reaction.emoji.identifier
                        ].get({ query: { limit, before, after } });
                        const users = new Collection();
                        for (const rawUser of data) {
                          const user = this.client.users.add(rawUser);
                          this.cache.set(user.id, user);
                          users.set(user.id, user);
                        }
                        return users;
                      }*/
                      
                    
                    
                    
                        
                    
                    
                    //console.log(await (await reaction.message.channel.messages.fetch(setup.REACTION_ROLES.BOT.MESSAGE_ID)).reactions.cache);
                    //console.log(reaction.message.guild.members.cache.get(user.id));
                    //console.log(reaction.message.reactions);
                    //console.log(Array.from(reaction.message.reactions.cache.map(({users})=> users)));
                    //if (await (await reaction.message.channel.messages.fetch(setup.REACTION_ROLES.BOT.MESSAGE_ID)).reactions..has(reaction.message.guild.members.cache.get(user.id))) {
                    //    console.log()
                    //}
                    //let reactionVar = reaction.message.reactions;
                    //console.log(reactionVar);
                    //let usersVar = reactionVar.users 
                    //let reactionVar = await reaction.message.channel.messages.fetch(reaction.message.id).reactions;
                    //console.log(reactionVar);
                    //let usersVar = reactionVar.users.map(u => u.toString());
                    //console.log(usersVar);

                    
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
                if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Verified.ROLE_ID)) {
                    console.log("success");
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.BOT.ROLE_ID);
                } else if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.BOT.TEMP_ROLE_ID);
                }
            }
        break;

        case setup.REACTION_ROLES.Zene.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Zene.MESSAGE_ID) {
                if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Verified.ROLE_ID)) {
                    console.log("success");
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Zene.ROLE_ID);
                } else if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Zene.TEMP_ROLE_ID);
                }
            }
        break;

        case setup.REACTION_ROLES.Gaming.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.MESSAGE_ID) {
                if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Verified.ROLE_ID)) {
                    console.log("success");
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Gaming.ROLE_ID);
                } else if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Gaming.TEMP_ROLE_ID);
                }
            }
        break;

        case setup.REACTION_ROLES.Teszter.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Teszter.MESSAGE_ID) {
                if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Verified.ROLE_ID)) {
                    console.log("success");
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Teszter.ROLE_ID);
                } else if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Ezek_erdekelnek.ROLE_ID)) {
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Teszter.TEMP_ROLE_ID);
                }
            }
        break;

        case setup.REACTION_ROLES.Spam.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Spam.MESSAGE_ID) {
                if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Verified.ROLE_ID)) {
                    console.log("success");
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
    publicmsg = setup.LEFT_PUBLIC_MESSAGE;
    publicchannel = setup.REACTION_ROLES.Rendszeruzenetek.CHANNEL_ID;

    if (publicmsg && publicchannel) {
        let channel = member.guild.channels.cache.find(val => val.name === publicchannel) || member.guild.channels.cache.get(publicchannel);
        if (!channel) {
          console.log(`Channel "${publicchannel}" not found`);
        } else {
          if (channel.permissionsFor(bot.user).has('SEND_MESSAGES')) {
            // Prepare the Message by replacing the @MEMBER tag to the user mention
            if (typeof publicmsg === "object") {
              // Embed
              embed = publicmsg;
              channel.send({
                embed
              });
            } else {
              msg = publicmsg.replace(setup.USER_NAME, `${member.user}`);
              msg = msg.replace(setup.SERVER_NAME, `${member.guild.name}`);
  
              // Send the Message
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
var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 21, 20, 0, 0) - now;
if (millisTill10 < 0) {
     millisTill10 += 86400000; // it's after 10am, try 10am tomorrow.
}


setTimeout(function(){birthday(now.getFullYear(), now.getMonth()+1, now.getDate())}, millisTill10);

bot.login(config.TOKEN);