console.log("Starting up...");

const Discord = require('discord.js');
const bot = new Discord.Client({
    partials: ['USER', 'GUILD_MEMBER', 'CHANNEL', 'MESSAGE', 'REACTION']
});
let setup = require('../database/setup.json');
let config = require(setup.CONFIG_PATH);
let token = config.MAIN.TOKEN;
let users = require(setup.USERS_PATH);
let prefix = config.MAIN.PREFIX;
let database = require(setup.DATABASE_PATH);
let timetable = require(setup.TIMETABLE_PATH);
const childProcess = require('child_process');
const fs = require('fs');
const {set} = require('mongoose');
const {userInfo} = require('os');
/*runScript(setup.TEST_PATH, function (err) {
    if (err) throw err;
    console.log('finished running');
});*/
let splitted;
let beSent;
let replyTemp;
const readline = require("readline");
let remoteMsg;
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(setup.COMMANDS_PATH).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(setup.COMMANDS_PATH + file);
    bot.commands.set(command.name, command);
}
let now = new Date();

console.log("testReady");
bot.on('ready', () => {
    console.log(`${bot.user.tag} bot is now active (${monthToString(now.getMonth() + 1)} ${now.getDate()} ${now.getFullYear()} ${now.getHours() < 10 ? 0 : ""}${now.getHours()}:${now.getMinutes() < 10 ? 0 : ""}${now.getMinutes()}:${now.getSeconds() < 10 ? 0 : ""}${now.getSeconds()})`);
    bot.user.setPresence({status: "online", activity: {name: setup.STATUS, type: setup.ACTIVITY}});
    bot.channels.cache.get(setup.REACTION_CHANNELS.BOT.bot_info).send("Restarted...");
    //console.log(bot.user);
    //bot.channels.fetch('763463325228597278').then(guild => console.log(guild.messages.cache.map(msg => console.log(msg))));
    /*bot.channels.fetch('763463325228597278').then(channel => function (){
        const filter = m => (m.content.includes('discord'));
        const collector = channel.createMessageCollector(filter, { time: 10000 });
        console.log("collector started");
        collector.on('collect', m => console.log(`Collected ${m.content}`));
        collector.on('end', collected => console.log(`Collected ${collected.size} items`));
    })*/

});
console.log("testError");
bot.on('error', error => {
    bot.channels.cache.get(setup.REACTION_CHANNELS.BOT.bot_info).send(error);
});

/*process.on('unhandledRejection', err => {channelLog(err)});
process.on('uncaughtException', err => {channelLog(err)});
process.on('warning', err => {channelLog(err)});
process.on('exit', function () {console.log("exit"); bot.channels.cache.get(setup.REACTION_CHANNELS.BOT.bot_info).send('Stopped...')})*/

function channelLog(err) {bot.channels.cache.get(setup.REACTION_CHANNELS.BOT.bot_info).send("```js\n" + err + "\n```");}

function databaseUpdate(message) {
    setSetup();
    setToken();
    setConfig();
    setUsers();
    setPrefix();
    setDatabase();
    setTimetable();
    if (message) message.channel.send("Az adatbázisok sikeresen frissítve!")
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
    console.log(users);
}

function setPrefix() {
    delete require.cache[require.resolve(setup.CONFIG_PATH)];
    prefix = require(setup.CONFIG_PATH).MAIN.PREFIX;
}

function setDatabase() {
    delete require.cache[require.resolve(setup.DATABASE_PATH)];
    database = require(setup.DATABASE_PATH);
}

function setTimetable() {
    delete require.cache[require.resolve(setup.TIMETABLE_PATH)];
    database = require(setup.TIMETABLE_PATH);
}

function whichToSet(variable, message) {
    switch (variable) {
        case "setup":
            setSetup();
            if (message) successfulSet(message);
            break;
        case "token":
            setToken();
            if (message) successfulSet(message);
            break;
        case "config":
            setConfig();
            if (message) successfulSet(message);
            break;
        case "users":
            setUsers();
            if (message) successfulSet(message);
            break;
        case "prefix":
            setPrefix();
            if (message) successfulSet(message);
            break;
        case "database":
            setDatabase();
            if (message) successfulSet(message);
            break;
        case "timetable":
            setTimetable();
            if (message) successfulSet(message);
            break;
        default:
            if (message) message.channel.send("Érvénytelen paraméter!");
            break;
    }
}

function successfulSet(message) {
    message.channel.send("Az adatbázis sikeresen frissítve!")
}

function msgLC(args) {
    return args.content.toLowerCase();
}

function noPrefix(message, args) {
    return message.content.toLowerCase().includes(args);
}

function genderSearch(reaction, user) {
    for (let index = 0; index < users.USERS.length; index++) {
        if (users.USERS[index].USER_ID === user.id) {
            if (users.USERS[index].GENDER === "M") {
                return new Promise((resolve, reject) => {
                    console.log("M");
                    resolve(users.GENDERS_ROLE_ID.BOY)
                });
            } else if (users.USERS[index].GENDER === "F") {
                return new Promise((resolve, reject) => {
                    console.log("F");
                    resolve(users.GENDERS_ROLE_ID.GIRL)
                });
            } else {
                console.error("Invalid gender code!");
                return new Promise((resolve, reject) => {
                    resolve(undefined)
                });
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

function teamSearch(user) {
    for (let index = 0; index < users.USERS.length; index++) {
        //console.log("comp " + users.USERS[index].USER_ID + " " + user.id);
        //console.log(users.USERS[index].REAL);
        if (users.USERS[index].USER_ID === user.id && users.USERS[index].REAL === true) {
            //console.log("data " + users.TEAMS[users.USERS[index].SUBJECTS.TEAM])
            return users.TEAMS[users.USERS[index].SUBJECTS.TEAM];
        }
    }
}

function moderatorSearch(user) {
    for (let index = 0; index < users.USERS.length; index++) {
        if (users.USERS[index].USER_ID === user.id) {
            return users.USERS[index].MODERATOR;
        }
    }
}

function botDevSearch(user) {
    for (let index = 0; index < users.USERS.length; index++) {
        if (users.USERS[index].USER_ID === user.id) {
            return users.USERS[index].BOT_DEV;
        }
    }
}

function personalRole(user) {
    for (let index = 0; index < users.USERS.length; index++) {
        if (users.USERS[index].USER_ID === user.id) {
            return users.USERS[index].ROLE_ID;
        }
    }
}

function isReal(user) {
    for (let index = 0; index < users.USERS.length; index++) {
        if (users.USERS[index].USER_ID === user.id) {
            return users.USERS[index].REAL;
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
        if (DMuser !== undefined) {
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
            }
        });
}

function runScript(scriptPath, callback) {

    var invoked = false;
    var process = childProcess.fork(scriptPath);

    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

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

function idByNickname(name) {
    for (const raw of users.USERS) {
        if (name === raw.NICKNAME) {
            return raw.USER_ID;
        }
    }
}

function inappropriateGuild(guild) {
    if (guild !== null && guild.id !== setup.GUILD_ID) {
            guild.leave();
            console.log(`Guild ${guild} left`);
    }
}

async function findMessage(message, ID) {
    let found;
    message.guild.channels.cache.each(channel => {
        if (found) return;
        found = channel.messages.fetch(ID).catch(() => undefined);
    });
}

function removeReaction(channel_id, message_id, reaction, user) {bot.channels.cache.get(channel_id).messages.fetch(message_id).then(msg => msg.reactions.cache.get(reaction).users.remove(user.id))}
function fetchReactions(channel_id, message_id, reaction, user) {const r = bot.channels.cache.get(channel_id).messages.cache.get(message_id); if(r) return r.reactions.cache.get(reaction).users.cache.get(user.id);}
function reVerifyRoleAdd(channel_id, message_id, reaction, user, role, local_reaction){bot.channels.cache.get(channel_id).messages.fetch(message_id).then(message => message.reactions.cache.get(reaction).users.fetch(user.id).then(usr => {console.log(usr.get(user.id)); if (usr.get(user.id)) local_reaction.message.guild.members.cache.get(user.id).roles.add(role);}))}

console.log("testMessage");
bot.on('message', async (message) => {
    inappropriateGuild(message.guild);
    console.log("message");
    //console.log(message.author === bot.user);
    //console.log(message.channel)
    //message.react("❤")
    function hasAdmin() {return message.member.hasPermission("ADMINISTRATOR");}
    function isDM() {return message.guild === null;}

    beSent = "";
    replyTemp = [];
    remoteMsg = message;
    if (message.author.bot) return;
    let args = message.content.split(' ');
    let requiredPrefix = isDM() ? "" : prefix;

    if (message.content.toLowerCase() === "nem kellett volna még egyszer felköszöntened" && message.author.id === idByNickname("Lilko") && isDM()) {
        message.channel.startTyping();
        setTimeout(function () {
            message.channel.stopTyping();
            message.channel.send("Jajj, bocsánat... Én voltam annyira búta, hogy elfelejtettem, hogy egyszer már felköszöntettelek:pensive: Meg tudsz nekem bocsátani? Igérem, többé nem fordul elő!");
            setTimeout(function () {
                message.channel.startTyping();
                setTimeout(function () {
                    message.channel.stopTyping();
                    message.channel.send("Ki is törlöm azt a köszöntést, elég az az egy is")
                    setTimeout(async function () {
                        await message.channel.messages.fetch('773572268642664500').then(msg => {
                            msg.delete();
                        });
                    }, 500)
                }, 1000);
            }, 500);
        }, 2000);
    }

    //message.channel.send({embed: message.embeds[0]});
    //message.channel.messages.channel.send({embed: message.embeds[0]});
    //console.log(message);
    //console.log(message.embeds[0].video);

    switch (args[0].toLowerCase()) {
        case `${requiredPrefix}szin`:
            if (!isDM())
            bot.commands.get('szin').execute(await message, args, users, database);
            break;
        case `${requiredPrefix}szinek`:
            bot.commands.get('szinek').execute(await message, args, database);
            break;
        case `${requiredPrefix}rainbow`:
            if (message.author.id === idByNickname("Tuzsi") && !isDM())
            bot.commands.get('rainbow').execute(await message, args, users);
            break;
        case `${requiredPrefix}ping`:
            bot.commands.get('ping').execute(await message, args, bot);
            break;
        case `${requiredPrefix}random`:
            bot.commands.get('random').execute(message, args, database);
            break;
        case `${requiredPrefix}csapat`:
            bot.commands.get('csapat').execute(await message, args, database);
            break;
        case `${requiredPrefix}parancsok`:
            bot.commands.get('parancsok').execute(message, args, users);
            break;
        case `${requiredPrefix}nev`:
            bot.commands.get('nev').execute(message, args, users);
            break;
        case `${requiredPrefix}rang`:
            if (!isDM() && hasAdmin()) {
                bot.commands.get('rang').execute(await message, args, setup);
            }
            break;
        case `${requiredPrefix}orarend`:
            bot.commands.get('orarend').execute(await message, args, setup);
            break;
        case `${requiredPrefix}series`:
            bot.commands.get('series').execute(await message, args, bot);
            break;
        case `${requiredPrefix}dq`:
            bot.commands.get('dq').execute(await message, args, database, users);
            break;
        case `${requiredPrefix}verify`:
            if (!isDM() && hasAdmin()) {
                bot.commands.get('verify').execute(await message, args, setup);
                setSetup();
            }
            break;
        case `${requiredPrefix}ut`:
            //if (!isDM() && hasAdmin()) {
                console.log("success");
                updateTeams();

            //}
            break;
        case `${requiredPrefix}modify`:
            if (!isDM() && hasAdmin()) {
                bot.commands.get('modify').execute(await message, args, setup);
            }
            break;
        case `${requiredPrefix}leave`:
            if (!isDM() && message.author.id === idByNickname("Tuzsi")) {
                await message.guild.leave();
            }
            break;
        case `${requiredPrefix}kick`:
            if (!isDM() && message.author.id === idByNickname("Tuzsi")) {
                await message.guild.kick();
            }
            break;
        case `${requiredPrefix}message`:
            if (hasAdmin()) args.length === 2 ? message.channel.send("```json\n" + JSON.stringify(findMessage(message, args[1]), null, 2) + "\n```") : message.channel.send("Érvénytelen paraméter!");
            break;
        case `${requiredPrefix}database`:
            if (hasAdmin()) {
                switch (args.length) {
                    case 1:
                        databaseUpdate(message)
                        break;
                    case 2:
                        whichToSet(args[1], message);
                        break;
                    default:
                        message.channel.send("Érvénytelen paraméter!");
                        break;
                }
            }
            break;
        case `${requiredPrefix}szulinap`:
            bot.commands.get('szulinap').execute(await message, users, bot, args);
            break;
        case `${requiredPrefix}jon`:
            bot.commands.get('jon').execute(await message, args, users, timetable);
            break;
        case `${requiredPrefix}test`:
            if (!isDM() && hasAdmin()) {
                message.pin();
                message.unpin();
            }
            break;
    }
    if (message.author !== bot.user/* && message.author.id !== idByNickname("Tuzsi")/* && message.member.user.id != users.USERS.Tuzsi.USER_ID*/) {
        database.INAPPROPRIATE.forEach(function (word) {
            if (noPrefix(message, word)) {
                splitted = message.toString().toLowerCase().split(" ");
                console.log(splitted);
                splitted.forEach(function (msg) {
                    if (msg.includes(word) && !replyTemp.includes(msg)) {
                        replyTemp.push(msg);
                    }
                })
            }
        });
        replyTemp.forEach(msg => beSent += (beSent === "" ? "" : " ") + msg);
        if (beSent) {
            message.channel.send(`${message.author} te vagy ${beSent}!`)
        }
        database.GREETINGS.forEach(function (word) {
            if (msgLC(message) === word || msgLC(message) === word + "!" || msgLC(message) === word + ".") {
                message.channel.send(`Szia ${message.author}!`);
            }
        });
    }

    if (message.channel.id === setup.REACTION_CHANNELS.Spam.one_word_story_in_english && args.length > 1) {
        await message.channel.messages.fetch({limit: 1}).then(messages => {
            message.channel.bulkDelete(messages);
        });
    }

    function updateTeams() {
        //let usrcnt = 0;
        //console.log(message.guild.members);
        message.guild.members.cache.forEach(member => {
            //console.log(member.displayName);
            //users.USERS.SUBJECTS.TEAM.forEach(team => {
                //let foundUser = users.USERS.find(u => u.id === member.id);
                //usrcnt++;
                //console.log("user " + member.id + " " + member.displayName + " " + usrcnt);
                let role = teamSearch(member);
                users.TEAMS.forEach(team => {
                    //console.log("team " + team);
                    if (member.roles.cache.has(team) && !member.roles.cache.has(role)) member.roles.remove(team);
                })
                if (role) member.roles.add(role);
            //})
        })
    }

    function addRoleByID(id) {message.guild.members.cache.get(message.author.id).roles.add(id);}
});

bot.on('channelUpdate', (oldChannel, newChannel) => {onChannelChange(newChannel)});
bot.on('channelCreate', (channel) => {onChannelChange(channel)});
bot.on('channelDelete', (channel) => {onChannelChange(channel)});;

function onChannelChange(channel) {
    if (channel.guild === null) return;
    //console.log(channel.guild.channels.cache);
    channel.fetch().then(channels => {console.log(channels)});
}

console.log("testReacted");
bot.on('messageReactionAdd', async (reaction, user) => {
    inappropriateGuild(reaction.message.guild);
    //console.log("reacted");
    //console.log(reaction);
    //fetchReactions(setup.REACTION_ROLES.Ezek_erdekelnek.CHANNEL_ID, setup.REACTION_ROLES.BOT.MESSAGE_ID, setup.REACTION_ROLES.BOT.REACTION, user)
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    if (user.bot) return;
    if (!reaction.message.guild) return;

    console.log(reaction.message.id + "\n" + reaction.emoji.name);

    switch (reaction.emoji.name) {
        case setup.REACTION_ROLES.BOT.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.BOT.MESSAGE_ID) {
                if (await hasRole("Verified")) {
                    roleAdd("BOT");
                }
            }
            break;

        case setup.REACTION_ROLES.Zene.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Zene.MESSAGE_ID) {
                if (await hasRole("Verified")) {
                    roleAdd("Zene");
                }
            }
            break;

        case setup.REACTION_ROLES.Gaming.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.MESSAGE_ID) {
                if (await hasRole("Verified")) {
                    roleAdd("Gaming");
                }
            }
            break;

        case setup.REACTION_ROLES.Teszter.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Teszter.MESSAGE_ID) {
                if (await hasRole("Verified")) {
                    roleAdd("Teszter");
                }
            }
            break;

        case setup.REACTION_ROLES.Spam.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Spam.MESSAGE_ID) {
                if (await hasRole("Verified")) {
                    roleAdd("Spam");
                }
            }
            break;

        case setup.REACTION_ROLES.Verified.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Verified.MESSAGE_ID) {
                if (reaction.emoji.name === setup.REACTION_ROLES.Verified.REACTION) {
                    if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Unverified.ROLE_ID)) {
                        if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Tag.ROLE_ID)) {
                            roleAdd("Verified");
                            reVerifyReactionRoleAdd("Gaming");
                            reVerifyReactionRoleAdd("Zene");
                            reVerifyReactionRoleAdd("Spam");
                            reVerifyReactionRoleAdd("Teszter");
                            reVerifyReactionRoleAdd("BOT");
                            if (moderatorSearch(user)) roleAdd("Moderator");
                            genderSearch(reaction, user).then(result => {
                                console.log("YEET " + result);
                                if (result) reaction.message.guild.members.cache.get(user.id).roles.add(result);
                            })
                            await reaction.message.guild.members.cache.get(user.id).roles.add(personalRole(user));
                            if(botDevSearch(user)) roleAdd("Bot_Dev");
                        } else {
                            roleAdd("Ezek_erdekelnek");
                        }
                    }
                    removeRole("Unverified");
                    /*try {
                        await reaction.users.remove(user.id);
                    } catch (error) {
                        console.error('Failed to remove reactions.');
                    }*/
                }
            }
            break;

        case setup.REACTION_ROLES.Ezek_erdekelnek.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Ezek_erdekelnek.MESSAGE_ID) {
                if (reaction.emoji.name === setup.REACTION_ROLES.Ezek_erdekelnek.REACTION) {
                    roleAdd("Verified");
                    roleAdd("Tag");
                    console.log("id " + users.TEAMS[teamSearch(user)]);
                    addRoleByID(teamSearch(user));
                    //if (isReal(user)) roleAdd("Tag");
                    removeRole("Ezek_erdekelnek");
                    genderSearch(reaction, user).then(result => {
                        if (result) reaction.message.guild.members.cache.get(user.id).roles.add(result);
                    })
                    if (moderatorSearch(user)) roleAdd("Moderator");

                    await reaction.message.guild.members.cache.get(user.id).setNickname(nicknameSearch(reaction, user));

                    try {
                        await reaction.users.remove(user.id);
                    } catch (error) {
                        console.error('Failed to remove reactions.');
                    }

                    if (fetchReactionRolesReactions("BOT")) {
                        roleAdd("BOT");
                    }
                    if (fetchReactionRolesReactions("Gaming")) {
                        roleAdd("Gaming");
                    }
                    if (fetchReactionRolesReactions("Zene")) {
                        roleAdd("Zene");
                    }
                    if (fetchReactionRolesReactions("Spam")) {
                        roleAdd("Spam");
                    }
                    if (fetchReactionRolesReactions("Teszter")) {
                        roleAdd("Teszter");
                    }

                    await reaction.message.guild.members.cache.get(user.id).roles.add(personalRole(user));
                    if(botDevSearch(user)) roleAdd("Bot_Dev");
                }
            }
            break;

        default:
            break;
    }

    function reVerifyReactionRoleAdd(object) {
        reVerifyRoleAdd(setup.REACTION_ROLES.Ezek_erdekelnek.CHANNEL_ID, setup.REACTION_ROLES[object].MESSAGE_ID, setup.REACTION_ROLES[object].REACTION, user, setup.REACTION_ROLES[object].ROLE_ID, reaction)
    }
    function fetchReactionRolesReactions(object) {return fetchReactions(setup.REACTION_ROLES.Ezek_erdekelnek.CHANNEL_ID, setup.REACTION_ROLES[object].MESSAGE_ID, setup.REACTION_ROLES[object].REACTION, user);}
    async function roleAdd(object) {await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES[object].ROLE_ID);}
    async function removeRole(object) {await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES[object].ROLE_ID);}
    function hasRole(object) {return reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES[object].ROLE_ID);}
    function addRoleByID(id) {reaction.message.guild.members.cache.get(user.id).roles.add(id);}

});
console.log("testUnreacted");
bot.on('messageReactionRemove', async (reaction, user) => {
    inappropriateGuild(reaction.message.guild);
    console.log("unreacted");
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (!userFound()) return;

    switch (reaction.emoji.name) {
        case setup.REACTION_ROLES.Verified.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Verified.MESSAGE_ID) {
                if (reaction.emoji.name === setup.REACTION_ROLES.Verified.REACTION) {
                    if (reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES.Tag.ROLE_ID)) {
                        roleAdd("Unverified");
                        removeRole("BOT");
                        removeRole("Zene");
                        removeRole("Gaming");
                        removeRole("Teszter");
                        removeRole("Spam");
                        removeRole("Verified");
                        removeRole("Moderator");
                        removeRole("Bot_Dev");
                        await reaction.message.guild.members.cache.get(user.id).roles.remove(personalRole(user));
                        genderSearch(reaction, user).then(result => {
                            if (result) reaction.message.guild.members.cache.get(user.id).roles.remove(result);
                        })

                    }
                }
            }
            break;

        case setup.REACTION_ROLES.BOT.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.BOT.MESSAGE_ID) {
                if (await hasRole("Verified")) {
                    removeRole("BOT");
                }
            }
            break;

        case setup.REACTION_ROLES.Zene.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Zene.MESSAGE_ID) {
                if (await hasRole("Verified")) {
                    removeRole("Zene");
                }
            }
            break;

        case setup.REACTION_ROLES.Gaming.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.MESSAGE_ID) {
                if (await hasRole("Verified")) {
                    removeRole("Gaming");
                }
            }
            break;

        case setup.REACTION_ROLES.Teszter.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Teszter.MESSAGE_ID) {
                if (await hasRole("Verified")) {
                    removeRole("Teszter");
                }
            }
            break;

        case setup.REACTION_ROLES.Spam.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Spam.MESSAGE_ID) {
                if (await hasRole("Verified")) {
                    removeRole("Spam");
                }
            }
            break;
    }
    async function removeRole(object) {await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES[object].ROLE_ID);}
    async function roleAdd(object) {await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES[object].ROLE_ID);}
    function hasRole(object) {return reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES[object].ROLE_ID)}
    function userFound() {return !!reaction.message.guild.members.cache.get(user.id);}
    function removeRoleByID(id) {reaction.message.guild.members.cache.get(user.id).roles.remove(id);}


});
console.log("testMemberAdd");
bot.on('guildMemberAdd', member => {
    inappropriateGuild(member.guild);
    console.log("memberAdd");
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
console.log("testMemberRemove");
bot.on('guildMemberRemove', async member => {
    inappropriateGuild(member.guild);
    console.log("memberRemove");
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
    
    function reactionRoleReset(object) {removeReaction(setup.REACTION_ROLES.Ezek_erdekelnek.CHANNEL_ID, setup.REACTION_ROLES[object].MESSAGE_ID, setup.REACTION_ROLES[object].REACTION, member);}

    reactionRoleReset("BOT");
    reactionRoleReset("Gaming");
    reactionRoleReset("Zene");
    reactionRoleReset("Spam");
    reactionRoleReset("Teszter");
    removeReaction(setup.REACTION_ROLES.Verified.CHANNEL_ID, setup.REACTION_ROLES.Verified.MESSAGE_ID, setup.REACTION_ROLES.Verified.REACTION, member);

    //bot.channels.cache.get(setup.REACTION_ROLES.Ezek_erdekelnek.CHANNEL_ID).messages.fetch(setup.REACTION_ROLES.BOT.MESSAGE_ID).then(msg => msg.reactions.cache.get(setup.REACTION_ROLES.BOT.REACTION).users.remove(user.id))

});

/*now = new Date();
let ms = new Date(now.getFullYear(), now.getMonth(), now.getDate(), setup.BIRTHDAY_NOTIFICATION_TIME.HOURS, setup.BIRTHDAY_NOTIFICATION_TIME.MINUTES, setup.BIRTHDAY_NOTIFICATION_TIME.SECONDS, setup.BIRTHDAY_NOTIFICATION_TIME.MILLISECONDS) - now;
console.log(ms);
if (ms < 0) {
     ms += 86400000;
}

setTimeout(function(){now = new Date(); birthday(date.getFullYear(), date.getMonth()+1, date.getDate())}, ms);*/

setInterval(function () {
    now = new Date();
    if (now.getHours() === setup.BIRTHDAY_NOTIFICATION_TIME.HOURS && now.getMinutes() === setup.BIRTHDAY_NOTIFICATION_TIME.MINUTES && now.getSeconds() === setup.BIRTHDAY_NOTIFICATION_TIME.SECONDS) {
        birthday(now.getFullYear(), now.getMonth() + 1, now.getDate());
    }
}, 1000);

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
    readMessage = read.replace(readChannel, "");
    try {
        bot.channels.cache.get(readChannel).send(readMessage);
    } catch {
        try {
            /*bot.guilds.cache.get('633701805020151828').members.fetch().then(fetchedMembers => {
                const totalOnline = fetchedMembers.filter(member => member.presence.status === 'online');
                // We now have a collection with all online member objects in the totalOnline variable
                console.log(`There are currently ${totalOnline.size} members online in this guild!`)
            });*/
            //bot.guilds.cache.get('633701805020151828').members.cache.get(readChannel).send(readMessage);
            console.log('ready');
            //bot.guilds.cache.get('633701805020151828').members.fetch(fetchedMember => {console.log(fetchedMember)});
            console.log('done');
        } catch (e) {
            console.error(e);
        }
    }
});

bot.login(token);
