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
let commands = require(setup.COMMANDS_DB_PATH);
const childProcess = require('child_process');
const fs = require('fs');

/*runScript(setup.TEST_PATH, function (err) {
    if (err) throw err;
    console.log('finished running');
});*/

let split;
let beSent;
let replyTemp;
const readline = require("readline");
const nodemon = require('nodemon');
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
    /*bot.api.applications(bot.user.id).guilds('633701805020151828').commands.post({data: {
        name: 'test',
        description: 'slash command test'
    }})*/
    console.log(bot.api);
});
console.log("testError");
bot.on('error', error => {
    bot.channels.cache.get(setup.REACTION_CHANNELS.BOT.bot_info).send(error);
});

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
                    resolve(users.GENDERS_ROLE_ID.BOY)
                });
            } else if (users.USERS[index].GENDER === "F") {
                return new Promise((resolve, reject) => {
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
            //console.log("data " + users.TEAMS[users.USERS[index].SUBJECTS.TEAM].ID)
            return users.TEAMS[users.USERS[index].SUBJECTS.TEAM].ID;
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

function gameTesterSearch(user) {
    for (let index = 0; index < users.USERS.length; index++) {
        if (users.USERS[index].USER_ID === user.id) {
            return users.USERS[index].GAME_TESTER;
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
            return users.USERS[index2].USER_ID;
        }
    }
    return false;
}

function isGuest(member) {
    for (let index2 = 0; index2 < users.GUESTS.length; index2++) {
        if (users.GUESTS[index2] === member.user.id) {
            return users.GUESTS[index2];
        }
    }
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

function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
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
    return message.channel.messages.fetch(ID);
}

function removeReaction(channel_id, message_id, reaction, user) {bot.channels.cache.get(channel_id).messages.fetch(message_id).then(msg => msg.reactions.cache.get(reaction).users.remove(user.id))}
function fetchReactions(channel_id, message_id, reaction, user) {const r = bot.channels.cache.get(channel_id).messages.cache.get(message_id); if(r) return r.reactions.cache.get(reaction).users.cache.get(user.id);}
function reVerifyRoleAdd(channel_id, message_id, reaction, user, role, local_reaction){bot.channels.cache.get(channel_id).messages.fetch(message_id).then(message => message.reactions.cache.get(reaction).users.fetch(user.id).then(usr => {if (usr.get(user.id)) local_reaction.message.guild.members.cache.get(user.id).roles.add(role);}))}

console.log("testMessage");
bot.on('message', async (message) => {
    inappropriateGuild(message.guild);
    //console.log(`m g: ${message.guild.id} c: ${message.channel.id} m: ${message.id} u: ${message.author.id}`);

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
            bot.commands.get('random').execute(message, args, users);
            break;
        case `${requiredPrefix}csapat`:
            bot.commands.get('csapat').execute(await message, args, database, users);
            break;
        case `${requiredPrefix}parancsok`:
            bot.commands.get('parancsok').execute(message, args, users, commands, prefix);
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
        case `${requiredPrefix}teams`:
            if (!isDM() && hasAdmin()) {
                updateTeams();
            }
            break;
        case `${requiredPrefix}becenev`:
            if (!isDM() && hasAdmin()) {
                bot.commands.get('becenev').execute(await message, args, users, setup);
            }
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
            if (hasAdmin()) findMessage(message, args[1]).then(msg => args.length === 2 ? message.channel.send("```json\n" + JSON.stringify(msg, null, 2) + "\n```") : message.channel.send("Érvénytelen paraméter!"));
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
                split = message.toString().toLowerCase().split(" ");
                split.forEach(function (msg) {
                    if (msg.includes(word) && !replyTemp.includes(msg)) {
                        replyTemp.push(msg);
                    }
                })
            }
        });
        replyTemp.forEach(msg => beSent += (beSent === "" ? "" : " ") + msg);
        if (beSent) {
            message.channel.send(`${message.author} te vagy ${beSent.replace(/[!-?{-¿\[-`÷ʹ-͢]/g, "")}!`);
        }
        database.GREETINGS.forEach(function (word) {
            if (msgLC(message) === word || msgLC(message) === word + "!" || msgLC(message) === word + ".") {
                message.channel.send(`Szia ${message.author}!`);
            }
        });
        database.RESPOND.forEach(function (word) {
            if (msgLC(message) === word.FROM || msgLC(message) === word.FROM + "!" || msgLC(message) === word.FROM + ".") {
                message.channel.send(word.TO, {tts: word.TTS});
            }
        });

    }

    if (message.channel.id === setup.REACTION_CHANNELS.Spam.one_word_story_in_english && args.length > 1) {
        await message.channel.messages.fetch({limit: 1}).then(messages => {
            message.channel.bulkDelete(messages);
        });
    } else if (message.channel.id === setup.REACTION_CHANNELS.Spam.null_width_space && message.content !== "\u200b") {
        await message.channel.messages.fetch({limit: 1}).then(messages => {
            message.channel.bulkDelete(messages);
        });
    }

    function updateTeams() {
        users.TEAMS.forEach(team => {
            message.guild.roles.cache.find(r => r.id === team.ID).edit({name: team.NAME});
            bot.channels.cache.get(team.TEXT_ID).setName(team.NAME);
            bot.channels.cache.get(team.VOICE_ID).setName(team.NAME);
        });
        message.guild.members.cache.forEach(member => {
            let role = teamSearch(member);
            users.TEAMS.forEach(team => {
                if (member.roles.cache.has(team.ID) && !member.roles.cache.has(role)) member.roles.remove(team.ID);
            })
            if (role && member.roles.cache.has(setup.REACTION_ROLES.Verified.ROLE_ID)) member.roles.add(role);
        })
    }

    function addRoleByID(id) {message.guild.members.cache.get(message.author.id).roles.add(id);}
});

/*bot.on('channelUpdate', (oldChannel, newChannel) => {onChannelChange(newChannel)});
bot.on('channelCreate', (channel) => {onChannelChange(channel)});
bot.on('channelDelete', (channel) => {onChannelChange(channel)});

function onChannelChange(channel) {
    if (channel.guild === null) return;
    //console.log(channel.guild.channels.cache);
    channel.fetch().then(channels => {console.log(channels)});
}*/

console.log("testReacted");
bot.on('messageReactionAdd', async (reaction, user) => {
    console.log(`r+ g: ${reaction.message.guild.id} c: ${reaction.message.channel.id} m: ${reaction.message.id} u: ${user.id} ${reaction.emoji.name}`);

    inappropriateGuild(reaction.message.guild);
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    if (user.bot) return;
    if (!reaction.message.guild) return;

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

        case setup.REACTION_ROLES.Programozas.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Programozas.MESSAGE_ID) {
                if (await hasRole("Verified")) {
                    roleAdd("Programozas");
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
                            reVerifyReactionRoleAdd("Programozas");
                            reVerifyReactionRoleAdd("Teszter");
                            reVerifyReactionRoleAdd("BOT");
                            if (moderatorSearch(user)) roleAdd("Moderator");
                            if (gameTesterSearch(user)) roleAdd("Game_Tester");
                            genderSearch(reaction, user).then(result => {
                                if (result) reaction.message.guild.members.cache.get(user.id).roles.add(result);
                            })
                            await reaction.message.guild.members.cache.get(user.id).roles.add(personalRole(user));
                            if(botDevSearch(user)) roleAdd("Bot_Dev");
                        } else {
                            roleAdd("Ezek_erdekelnek");
                        }
                    }
                    removeRole("Unverified");
                }
            }
            break;

        case setup.REACTION_ROLES.Ezek_erdekelnek.REACTION :
            if (reaction.message.id === setup.REACTION_ROLES.Ezek_erdekelnek.MESSAGE_ID) {
                if (reaction.emoji.name === setup.REACTION_ROLES.Ezek_erdekelnek.REACTION) {
                    roleAdd("Verified");
                    roleAdd("Tag");
                    if (teamSearch(user)) addRoleByID(teamSearch(user));
                    //if (isReal(user)) roleAdd("Tag");
                    removeRole("Ezek_erdekelnek");
                    if (genderSearch(reaction, user)) {
                        genderSearch(reaction, user).then(result => {
                            if (result) reaction.message.guild.members.cache.get(user.id).roles.add(result);
                        });
                        if (moderatorSearch(user)) roleAdd("Moderator");
                        if (gameTesterSearch(user)) roleAdd("Game_Tester");
                    }

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
                    if (fetchReactionRolesReactions("Programozas")) {
                        roleAdd("Programozas");
                    }
                    if (fetchReactionRolesReactions("Teszter")) {
                        roleAdd("Teszter");
                    }

                    if (reaction.message.guild.members.cache.get(user.id).roles && personalRole(user)) await reaction.message.guild.members.cache.get(user.id).roles.add(personalRole(user));
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
    console.log(`r- g: ${reaction.message.guild.id} c: ${reaction.message.channel.id} m: ${reaction.message.id} u: ${user.id} ${reaction.emoji.name}`);
    inappropriateGuild(reaction.message.guild);
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
                        removeRole("Programozas");
                        removeRole("Verified");
                        removeRole("Moderator");
                        removeRole("Game_Tester");
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

            case setup.REACTION_ROLES.Programozas.REACTION :
                if (reaction.message.id === setup.REACTION_ROLES.Programozas.MESSAGE_ID) {
                    if (await hasRole("Verified")) {
                        removeRole("Programozas");
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
    console.log(`m+ ${member.id} in class: ${!!isInThisClass(member)} bot: ${!!member.user.bot} guest: ${!!isGuest(member)}`);
    inappropriateGuild(member.guild);
    if (isInThisClass(member)) {
        console.log("class")
        const raw = setup.WELCOME_MESSAGE;
        const dm = raw.replace(setup.USER_NAME, `${member.user}`).replace(setup.SERVER_NAME, `${member.guild.name}`);
        member.send(dm);
        member.roles.add(setup.REACTION_ROLES.Unverified.ROLE_ID);
    } else if (member.user.bot) {
        console.log("bot")
        member.roles.add(setup.REACTION_ROLES.Bot.ROLE_ID);
    } else if (isGuest(member)) {
        console.log("guest")
        member.roles.add(setup.REACTION_ROLES.Vendeg.ROLE_ID);
    } else {
        console.log("none")
        const raw = setup.NOT_IN_THIS_CLASS_MESSAGE;
        const dm = raw.replace(setup.USER_NAME, `${member.user}`).replace(setup.SERVER_NAME, `${member.guild.name}`);
        member.send(dm).then(() => {member.kick();});

    }
});
console.log("testMemberRemove");
bot.on('guildMemberRemove', async member => {
    console.log(`m- ${member.id}`);
    inappropriateGuild(member.guild);
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
    reactionRoleReset("Programozas");
    reactionRoleReset("Teszter");
    removeReaction(setup.REACTION_ROLES.Verified.CHANNEL_ID, setup.REACTION_ROLES.Verified.MESSAGE_ID, setup.REACTION_ROLES.Verified.REACTION, member);
});

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
    readMessage = replaceAll(replaceAll(read.replace(readChannel + " ", ""), "\\n", "\n"), "\\\n", "\\n");
    bot.channels.fetch(readChannel).then(channel => {
        channel.send(readMessage);
    }).catch((channel) => console.error(channel));
});

bot.login(token);
