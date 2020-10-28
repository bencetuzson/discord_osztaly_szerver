console.log("Starting up...");

const Discord = require('discord.js');
const bot = new Discord.Client({
	partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
let setup = require('../database/setup.json');
let config = require(setup.CONFIG_PATH);
let token = require(setup.CONFIG_PATH).MAIN.TOKEN;
let users = require(setup.USERS_PATH);
let prefix = require(setup.CONFIG_PATH).MAIN.PREFIX;
let database = require(setup.DATABASE_PATH);
const fs = require('fs');
const { set } = require('mongoose');
const { userInfo } = require('os');
let splitted;
let beSent;
let replyTemp;
const readline = require("readline");
let remoteMsg;
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(setup.COMMANDS_PATH).filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(setup.COMMANDS_PATH + file);
    bot.commands.set(command.name, command);
}
let now = new Date();

bot.on('ready', ()=>{
    console.log(`${bot.user.tag} bot is now active (${monthToString(now.getMonth()+1)} ${now.getDate()} ${now.getFullYear()} ${now.getHours() < 10 ? 0 : ""}${now.getHours()}:${now.getMinutes() < 10 ? 0 : ""}${now.getMinutes()}:${now.getSeconds() < 10 ? 0 : ""}${now.getSeconds()})`);
    bot.user.setActivity(setup.STATUS, {type: setup.ACTIVITY});
    bot.channels.cache.get(setup.REACTION_CHANNELS.BOT.bot_info).send("Restarted...");
});

bot.on('unhandledRejection', error => {
    bot.channels.cache.get(setup.REACTION_CHANNELS.BOT.bot_info).send(error);
});

function databaseUpdate(message) {
    setSetup();
    setToken();
    setConfig();
    setUsers();
    setPrefix();
    setDatabase();
    message.channel.send("Az adatbázisok sikeresen frissítve!")
}

function setSetup() {
    delete require.cache[require.resolve('../database/setup.json')];
    setup = require('../database/setup.json');
}

function setConfig() {
    delete require.cache[require.resolve(setup.CONFIG_PATH)];
    config = require(setup.CONFIG_PATH);
}

function setToken() {
    delete require.cache[require.resolve(setup.CONFIG_PATH)];
    token = require(setup.CONFIG_PATH).MAIN.TOKEN;
}

function setUsers() {
    delete require.cache[require.resolve(setup.USERS_PATH)];
    users = require(setup.USERS_PATH);
}

function setPrefix() {
    delete require.cache[require.resolve(setup.CONFIG_PATH)];
    prefix = require(setup.CONFIG_PATH).MAIN.PREFIX;
}

function setDatabase() {
    delete require.cache[require.resolve(setup.DATABASE_PATH)];
    database = require(setup.DATABASE_PATH);
}

function successfulSet(message) {
    message.channel.send("Az adatbázis sikeresen frissítve!")
}

function msgLC(args){
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
            } else {
                console.error("Invalid gender code!");
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
    const ages = [];
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
	let DMuser = bot.users.cache.get(birthdate(year, month, day)[indexBD]);
	if(DMuser !== undefined){
            let BDdm = BDraw.replace(setup.USER_NAME, `${bot.users.cache.get(birthdate(year, month, day)[indexBD])}`).replace(setup.AGE, `${age(year, month, day)[indexBD]}`);
            DMuser.send(BDdm);
        }
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

function monthToString(month) {
    switch (month) {
        case 1:
            return "Jan";
        case 2:
            return "Feb";
        case 3:
            return "Mar";
        case 4:
            return "Apr";
        case 5:
            return "May";
        case 6:
            return "Jun";
        case 7:
            return "Jul";
        case 8:
            return "Aug";
        case 9:
            return "Sep";
        case 10:
            return "Oct";
        case 11:
            return "Nov";
        case 12:
            return "Dec";
        default:
            break;
    }
}

function idByNickname(name) {for (const raw of users.USERS) {if (name === raw.NICKNAME) {return raw.USER_ID;}}}

bot.on('message', async (message, user) => {
    beSent = "";
    replyTemp = [];
    remoteMsg = message;
    if (message.author.bot){return}
    let args = message.content.substring(' ').split(' ');
    let prefixTemp;

    if (message.guild === null) {
        prefixTemp = "";
    } else {
        prefixTemp = prefix;
    }
    //message.channel.send({embed: message.embeds[0]});
    //message.channel.messages.channel.send({embed: message.embeds[0]});
    //console.log(message);
    //console.log(message.embeds[0].video);

    switch (args[0].toLowerCase()) {
        case `${prefix}ping`:
            bot.commands.get('ping').execute(await message, args);
            break;
        case `${prefixTemp}colour`:
            bot.commands.get('colour').execute(await message, args);
            break;
        case `${prefixTemp}random`:
            bot.commands.get('random').execute(message, args);
            break;
        case `${prefixTemp}csapat`:
            bot.commands.get('csapat').execute(await message, args);
            break;
        case `${prefixTemp}parancsok`:
            bot.commands.get('parancsok').execute(message, args);
            break;
        case `${prefixTemp}rang`:
            if(message.guild !== null && message.member.hasPermission("ADMINISTRATOR")){
                bot.commands.get('rang').execute(await message, args);
            }
            break;
        case `${prefixTemp}reakcio`:
            bot.commands.get('reakcio').execute(await message, args);
            break;
        case `${prefixTemp}orarend`:
            bot.commands.get('orarend').execute(await message, args);
            break;
        case `${prefixTemp}series`:
            bot.commands.get('series').execute(await message, args, bot);
            break;
        case `${prefixTemp}verify`:
            if(message.guild !== null && message.member.hasPermission("ADMINISTRATOR")){
                bot.commands.get('verify').execute(await message, args);
            }
            break;
        case `${prefixTemp}modify`:
            if(message.guild !== null && message.member.hasPermission("ADMINISTRATOR")){
                bot.commands.get('modify').execute(await message, args);
            }
            break;
        case `${prefixTemp}database`:
            if(message.guild !== null && message.member.hasPermission("ADMINISTRATOR")){
                switch (args.length) {
                    case 1:
                        databaseUpdate(message)
                        break;
                    case 2:
                        switch (args[1]) {
                            case "setup":
                                setSetup();
                                successfulSet(message);
                                break;
                            case "token":
                                setToken();
                                successfulSet(message);
                                break;
                            case "config":
                                setConfig();
                                successfulSet(message);
                                break;
                            case "users":
                                setUsers();
                                successfulSet(message);
                                break;
                            case "prefix":
                                setPrefix();
                                successfulSet(message);
                                break;
                            case "database":
                                setDatabase();
                                successfulSet(message);
                                break;
                            default:
                                message.channel.send("Érvénytelen paraméter!");
                                break;
                        }
                        break;
                    default:
                        message.channel.send("Érvénytelen paraméter!");
                        break;
                }
            }
            break;
        case `${prefixTemp}szulinap`:
                bot.commands.get('szulinap').execute(await message, user, users, bot, args);
            break;
        case `${prefixTemp}szolj`:
            bot.commands.get('szolj').execute(await message, args);
            break;
        case `${prefixTemp}jon`:
            bot.commands.get('jon').execute(await message, args, user, users);
            break;
        case `${prefixTemp}test`:
            if(message.guild !== null && message.member.hasPermission("ADMINISTRATOR")){
                console.log(setup);
            }
            break;
    }
    if (message.member.user.id !== setup.BOT_ID/* && message.author.id !== idByNickname("Tuzsi")/* && message.member.user.id != users.USERS.Tuzsi.USER_ID*/) {
        database.INAPPROPRIATE.forEach(function(word) {
            if (noPrefix(message, word)) {
                splitted = message.toString().toLowerCase().split(" ");
                console.log(splitted);
                splitted.forEach(function(msg){
                    if (msg.includes(word) && !replyTemp.includes(msg)) {
                        replyTemp.push(msg);
                    }
                })
            }
        });
        replyTemp.forEach(msg => beSent += (beSent === "" ? "" : " ") + msg);
        if (beSent) {message.channel.send(`${message.member.user} te vagy ${beSent}!`)}
        database.GREETINGS.forEach(function(word) {
            if (msgLC(message) === word || msgLC(message) === word + "!" || msgLC(message) === word + ".") {
                message.channel.send(`Szia ${message.member.user}!`);
            }
        });
    }

    if (message.channel.id === setup.REACTION_CHANNELS.Spam.one_word_story_in_english && args.length > 1) {
        await message.channel.messages.fetch({ limit: 1 }).then(messages => {
            message.channel.bulkDelete(messages);
        });
    }
});

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
                    }

                    reaction.message.guild.members.cache.get(user.id).setNickname(nicknameSearch(reaction, user));

                    try {
                        await reaction.users.remove(user.id);
                    } catch (error) {
                        console.error('Failed to remove reactions.');
                    }

                    if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.BOT.TEMP_ROLE_ID)) {
                        await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.BOT.ROLE_ID);
                        await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.BOT.TEMP_ROLE_ID);
                    }

                    if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Gaming.TEMP_ROLE_ID)) {
                        await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Gaming.ROLE_ID);
                        await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Gaming.TEMP_ROLE_ID);
                    }

                    if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Zene.TEMP_ROLE_ID)) {
                        await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Zene.ROLE_ID);
                        await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Zene.TEMP_ROLE_ID);
                    }

                    if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Spam.TEMP_ROLE_ID)) {
                        await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Spam.ROLE_ID);
                        await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Spam.TEMP_ROLE_ID);
                    }

                    if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Teszter.TEMP_ROLE_ID)) {
                        await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES.Teszter.ROLE_ID);
                        await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES.Teszter.TEMP_ROLE_ID);
                    }
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
        member.roles.add(setup.REACTION_ROLES.Bot.ROLE_ID);
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
            console.error(`Channel "${publicchannel}" not found`);
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
});

/*now = new Date();
let ms = new Date(now.getFullYear(), now.getMonth(), now.getDate(), setup.BIRTHDAY_NOTIFICATION_TIME.HOURS, setup.BIRTHDAY_NOTIFICATION_TIME.MINUTES, setup.BIRTHDAY_NOTIFICATION_TIME.SECONDS, setup.BIRTHDAY_NOTIFICATION_TIME.MILLISECONDS) - now;
console.log(ms);
if (ms < 0) {
     ms += 86400000;
}

setTimeout(function(){now = new Date(); birthday(date.getFullYear(), date.getMonth()+1, date.getDate())}, ms);*/

setInterval(function(){
    now = new Date();
    if (now.getHours() === setup.BIRTHDAY_NOTIFICATION_TIME.HOURS && now.getMinutes() === setup.BIRTHDAY_NOTIFICATION_TIME.MINUTES && now.getSeconds() === setup.BIRTHDAY_NOTIFICATION_TIME.SECONDS) {
        birthday(now.getFullYear(), now.getMonth()+1, now.getDate())}
    }, 1000
);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let read;
let readChannel;
let readMessage;
rl.on('line', (input) => {
    read = input;
    readChannel = read.split(" ")[0];
    readMessage = read.replace(readChannel);
    try {
        bot.channels.cache.get(readChannel).send(readMessage);
    } catch {
        try {
            bot.guilds.cache.get(readChannel).send(readMessage);
        } catch (e) {
            console.error(e);
        }
    }
});

bot.login(token);