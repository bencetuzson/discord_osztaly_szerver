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
let slash_commands = require(setup.SLASH_COMMANDS_PATH);
//let googleapi = require(setup.GOOGLEAPI_PATH);
//let googlecredentials = require(setup.GOOGLECREDENTIALS_PATH);
const status = `/${setup.HELP_COMMAND}`;
const childProcess = require('child_process');
const fs = require('fs');
const util = require('util');
const clock = require('date-events')();

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
bot.on('ready', async () => {
    console.log(`${bot.user.tag} bot is now active (${monthToString(now.getMonth() + 1)} ${now.getDate()} ${now.getFullYear()} ${now.getHours() < 10 ? 0 : ""}${now.getHours()}:${now.getMinutes() < 10 ? 0 : ""}${now.getMinutes()}:${now.getSeconds() < 10 ? 0 : ""}${now.getSeconds()})`);
    bot.user.setPresence({status: "online", activity: {name: setup.DB_STATUS ? setup.STATUS : status, type: setup.ACTIVITY}});
    bot.channels.cache.get(setup.REACTION_CHANNELS.BOT.bot_info).send("Restarted...");
    //console.log(await bot.api.applications(bot.user.id).guilds(setup.GUILD_ID).commands.get());
    //await bot.api.applications(bot.user.id).guilds(setup.GUILD_ID).commands("").delete();
    for (let i = 0; i < slash_commands.length; i++) {
        await bot.api.applications(bot.user.id).guilds(setup.GUILD_ID).commands.post({
            data: slash_commands[i]
        });
    }
});
console.log("testError");
bot.on('error', error => {
    bot.channels.cache.get(setup.REACTION_CHANNELS.BOT.bot_info).send(error);
});

function channelLog(err) {bot.channels.cache.get(setup.REACTION_CHANNELS.BOT.bot_info).send("```\n" + err + "\n```");}

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
        if (users.USERS[index].USER_ID === user.id && users.USERS[index].REAL === true) {
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
            return users.USERS[index].GitHub_Team;
        }
    }
}

function languageSearch(user) {
    for (let index = 0; index < users.USERS.length; index++) {
        if (users.USERS[index].USER_ID === user.id) {
            return users.USERS[index].SUBJECTS.LANGUAGE;
        }
    }
}

function groupSearch(user) {
    for (let index = 0; index < users.USERS.length; index++) {
        if (users.USERS[index].USER_ID === user.id) {
            return users.USERS[index].SUBJECTS.GROUPS;
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

function nicknameById(id) {
    for (const raw of users.USERS) {
        if (id === raw.USER_ID) {
            return raw.NICKNAME;
        }
    }
}

function inappropriateGuild(guild) {
    if (guild !== null && guild.id !== setup.GUILD_ID && guild.id !== setup.EMOTE_GUILD_ID) {
            guild.leave();
            console.log(`Guild ${guild} left`);
    }
}

async function findMessage(message, ID) {
    return message.channel.messages.fetch(ID);
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function classLength() {
    let names = [];
    for (let ind = 0; ind < users.USERS.length; ++ind) {
        if(users.USERS[ind].REAL){names.push(users.USERS[ind]);}
    }
    return names.length;
}

function isOnBlacklist(user_id) {return setup.BLACKLIST.includes(nicknameById(user_id));}

function removeReaction(channel_id, message_id, reaction, user) {bot.channels.cache.get(channel_id).messages.fetch(message_id).then(msg => msg.reactions.cache.get(reaction).users.remove(user.id))}
function fetchReactions(channel_id, message_id, reaction, user) {const r = bot.channels.cache.get(channel_id).messages.cache.get(message_id); if(r) return r.reactions.cache.get(reaction).users.cache.get(user.id);}
function reVerifyRoleAdd(channel_id, message_id, reaction, user, role, local_reaction){bot.channels.cache.get(channel_id).messages.fetch(message_id).then(message => message.reactions.cache.get(reaction).users.fetch(user.id).then(usr => {if (usr.get(user.id)) local_reaction.message.guild.members.cache.get(user.id).roles.add(role);}))}

bot.ws.on('INTERACTION_CREATE', async (interaction) => {
    const command = interaction.data.name.toLowerCase();
    const args = interaction.data.options;
    console.log(`i+ g: ${interaction.guild_id} c: ${interaction.channel_id} u: ${interaction.member.user.id}/${interaction.member.nick}`);
    console.log(util.inspect(interaction.data, false, null, true));

    if (!isOnBlacklist(interaction.member.user.id))
    switch (command) {
        case setup.HELP_COMMAND:
            bot.commands.get('parancsok').execute(interaction, args, users, commands, prefix, bot, database, timetable);
            break;
        case "random":
            bot.commands.get('random').execute(interaction, args, users, bot);
            break;
        case "csapat": case "parok": case "sorrend":
            bot.commands.get('csapat-parok-sorrend').execute(await interaction, args, database, users, bot, command);
            break;
        case "orarend":
            bot.commands.get('orarend').execute(await interaction, args, setup, bot);
            break;
        case "szulinap":
            bot.commands.get('szulinap').execute(await interaction, users, bot, args);
            break;
        case "orak":
            bot.commands.get('orak').execute(await interaction, args, users, timetable, bot);
            break;
        case "jon": case "most":
            bot.commands.get('jon-most').execute(await interaction, args, users, timetable, bot, command);
            break;
        case "szin":
            bot.commands.get('szin').execute(await interaction, args, users, database, bot);
            break;
        case "szinek":
            bot.commands.get('szinek').execute(await interaction, args, database, bot);
            break;
        case "dq":
            bot.commands.get('dq').execute(await interaction, args, database, users, bot);
            break;
        case "nev":
            bot.commands.get('nev').execute(interaction, args, users, bot);
            break;
        case "laptop":
            bot.commands.get('laptop').execute(await interaction, args, users, timetable, bot);
            break;
        case "email":
            bot.commands.get('email').execute(await interaction, args, users, bot);
            break;
        case "classroom": case "meet":
            bot.commands.get('classroom-meet').execute(await interaction, args, users, timetable, bot, command);
            break;
        case "meeten":
            bot.commands.get('meeten').execute(interaction, args, users, database, bot);
            break;
        case "gif":
            bot.commands.get('gif').execute(await interaction, args, bot);
            break;
        case "jegyek":
            bot.commands.get('jegyek').execute(await interaction, args, bot);
            break;
        case "szobak":
            bot.commands.get('szobak').execute(await interaction, args, setup, /*googleapi, googlecredentials,*/ bot);
            break;
        case "update":
            bot.commands.get('update').execute(await interaction, args, setup, slash_commands, bot);
            break;
        /*default:
            bot.api.interactions(interaction.id, interaction.token).callback.post({ data: { type: 4, data: {
                content: "```json\n" + JSON.stringify(interaction, null, 2) + "\n```"
            }}});
            break;*/
    }
});

console.log("testMessage");
bot.on('message', async (message) => {
    inappropriateGuild(message.guild);
    //console.log(`m+ g: ${message.guild.id} c: ${message.channel.id} m: ${message.id} u: ${message.author.id}`);

    function hasAdmin() {return message.member.hasPermission("ADMINISTRATOR");}
    function isDM() {return message.guild === null;}

    beSent = "";
    replyTemp = [];
    remoteMsg = message;
    if (message.author.bot) return;
    let args = message.content.split(' ');
    let requiredPrefix = isDM() ? "" : prefix;

    if (!isOnBlacklist(message.author.id))
    switch (args[0].toLowerCase()) {
        case `${requiredPrefix}rainbow`:
            if (message.author.id === idByNickname("Tuzsi") && !isDM())
            bot.commands.get('rainbow').execute(await message, args, users);
            break;
        case `${requiredPrefix}ping`:
            bot.commands.get('ping').execute(await message, args, bot);
            break;
        case `${requiredPrefix}rang`:
            if (!isDM() && hasAdmin()) {
                bot.commands.get('rang').execute(await message, args, setup);
            }
            break;
        case `${requiredPrefix}series`:
            bot.commands.get('series').execute(await message, args, bot);
            break;
        case `${requiredPrefix}verify`:
            if (!isDM() && hasAdmin()) {
                bot.commands.get('verify').execute(await message, args, setup, bot);
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
        case `${requiredPrefix}age`:
            if (!isDM() && hasAdmin() && idByNickname("Tuzsi")) {
                bot.commands.get('age').execute(await message, args, users);
            }
            break;
        case `${requiredPrefix}modify`:
            if (!isDM() && hasAdmin()) {
                bot.commands.get('modify').execute(await message, args, setup, bot);
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
        /*case `${requiredPrefix}bejonni`:
            bot.commands.get('bejonni').execute(await message, args, users, timetable);
            break;*/
        case `${requiredPrefix}test`:
            if (!isDM() && hasAdmin()) {
                message.pin();
                message.unpin();
            }
            break;
        case `msg`:
            if (isDM()) {
                bot.commands.get('msg').execute(await message, args, bot, users);
            }
            break;
    }

    if (message.author !== bot.user/* && message.author.id !== idByNickname("Tuzsi")*//* && message.member.user.id != users.USERS.Tuzsi.USER_ID*/) {
        let msg;
        let splitWord_exc;
        let splitMessage = message.content.replace(/[!-?{-¿\[-`÷ʹ-͢]/g, "").split(" ");
        let ind;
        let ind2;
        database.INAPPROPRIATE.forEach(function (word) {
            if (noPrefix(message, word)) {
                split = message.toString().toLowerCase().split(" ");
                split.forEach(function (msg) {
                    if (msg.includes(word) && !replyTemp.includes(msg)) {
                        database.INAPPROPRIATE_EXCEPTION.forEach(function (word_exc) {
                            if (word_exc.includes(word)) {
                                splitWord_exc = word_exc.split(" ");
                                ind = splitWord_exc.indexOf(word);
                                ind2 = splitMessage.indexOf(word);
                                if (splitMessage.slice(ind2 - ind, ind2 - ind + splitWord_exc.length).join(" ") === word_exc) {
                                    splitMessage.splice(ind2 - ind, splitWord_exc.length);
                                }
                            }
                        })
                    }
                });
                splitMessage.forEach(function (msg) {
                    if (msg.includes(word) && !replyTemp.includes(msg)) {
                        replyTemp.push(msg);
                    }
                });
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
        database.RESPOND.IS.forEach(function (word) {
            msg = message;
            if (!word.SAME) {
                msg.content = msg.content.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                word.FROM = word.FROM.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            }
            if (msgLC(msg) === word.FROM) {
                message.channel.send(word.TO, {tts: word.TTS});
            }
        });
        database.RESPOND.HAS.forEach(function (word) {
            msg = message;
            if (!word.SAME) {
                msg.content = msg.content.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                word.FROM = word.FROM.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            }
            if (msgLC(msg).includes(word.FROM)) {
                message.channel.send(word.TO, {tts: word.TTS});
            }
        });
        if (msgLC(message) === "szia matyi") {
            bot.users.cache.get(idByNickname("Matyi")).send("szia matyi");
        } else if (setup.MENTION_CHANNELS.includes(message.channel.id)) {
            users.USERS.forEach(function (user) {
                user.CALLED.forEach(function (name) {
                    if (msgLC(message).normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) {
                        bot.users.cache.get(user.USER_ID).send(`${message.author} megemlített egy üzenetben`)
                    }
                })
            });
        }
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

console.log("testReacted");
bot.on('messageReactionAdd', async (reaction, user) => {
    console.log(`r+ g: ${reaction.message.guild.id} c: ${reaction.message.channel.id} m: ${reaction.message.id} u: ${user.id} ${reaction.emoji.name}`);

    inappropriateGuild(reaction.message.guild);
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    if (user.bot) return;
    if (!reaction.message.guild) return;

    switch (reaction.emoji.name) {
        case setup.REACTION_ROLES.Gaming.CHANNELS.sim_racing.EMOTE_ID:
            console.log("test");
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                console.log("test2");
                interestRoleAdd("Gaming", "sim_racing");
            }
            break;

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
                            genderSearch(reaction, user).then(result => {
                                if (result) reaction.message.guild.members.cache.get(user.id).roles.add(result);
                            })
                            await reaction.message.guild.members.cache.get(user.id).roles.add(personalRole(user));
                            if (moderatorSearch(user)) roleAdd("Moderator");
                            if (gameTesterSearch(user)) roleAdd("Game_Tester");
                            if (botDevSearch(user)) roleAdd("GitHub_Team");
                            if (teamSearch(user)) addRoleByID(teamSearch(user));
                            switch (languageSearch(user)) {
                                case "G":
                                    roleAdd("Nemet");
                                    break;
                                case "F":
                                    roleAdd("Francia");
                                    break;
                            }
                            switch (groupSearch(user)) {
                                case 1:
                                    roleAdd("G1");
                                    break;
                                case 2:
                                    roleAdd("G2");
                                    break;
                            }
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
                    removeRole("Ezek_erdekelnek");
                    if (genderSearch(reaction, user)) {
                        genderSearch(reaction, user).then(result => {
                            if (result) reaction.message.guild.members.cache.get(user.id).roles.add(result);
                        });

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
                    if (moderatorSearch(user)) roleAdd("Moderator");
                    if (gameTesterSearch(user)) roleAdd("Game_Tester");
                    if (botDevSearch(user)) roleAdd("GitHub_Team");
                    switch (languageSearch(user)) {
                        case "G":
                            roleAdd("Nemet");
                            break;
                        case "F":
                            roleAdd("Francia");
                            break;
                    }
                    switch (groupSearch(user)) {
                        case 1:
                            roleAdd("G1");
                            break;
                        case 2:
                            roleAdd("G2");
                            break;
                    }
                }
            }
            break;

        default:
            break;
    }
    switch (reaction.emoji.id) {
        case setup.REACTION_ROLES.Gaming.CHANNELS.minecraft.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "minecraft");
            }
            break;
        case setup.REACTION_ROLES.Gaming.CHANNELS.paladins.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "paladins");
            }
            break;
        case setup.REACTION_ROLES.Gaming.CHANNELS.rocket_league.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "rocket_league");
            }
            break;
        case setup.REACTION_ROLES.Gaming.CHANNELS.pubg.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "pubg");
            }
            break;
        case setup.REACTION_ROLES.Gaming.CHANNELS.csgo.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "csgo");
            }
            break;
        case setup.REACTION_ROLES.Gaming.CHANNELS.r6s.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "r6s");
            }
            break;
        case setup.REACTION_ROLES.Gaming.CHANNELS.among_us.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "among_us");
            }
            break;
        case setup.REACTION_ROLES.Gaming.CHANNELS.fortnite.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "fortnite");
            }
            break;
        case setup.REACTION_ROLES.Gaming.CHANNELS.ark.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "ark");
            }
            break;
        case setup.REACTION_ROLES.Gaming.CHANNELS.fall_guys.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "fall_guys");
            }
            break;
        case setup.REACTION_ROLES.Gaming.CHANNELS.gta.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "gta");
            }
            break;
        case setup.REACTION_ROLES.Gaming.CHANNELS.league_of_legends.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "league_of_legends");
            }
            break;
        case setup.REACTION_ROLES.Gaming.CHANNELS.lego.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Gaming", "lego");
            }
            break;
        case setup.REACTION_ROLES.Programozas.CHANNELS.windows.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Programozas", "windows");
            }
            break;
        case setup.REACTION_ROLES.Programozas.CHANNELS.mac.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Programozas", "mac");
            }
            break;
        case setup.REACTION_ROLES.Programozas.CHANNELS.linux.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Programozas", "linux");
            }
            break;
        case setup.REACTION_ROLES.Programozas.CHANNELS.git.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Programozas", "git");
            }
            break;
        case setup.REACTION_ROLES.Programozas.CHANNELS.c_cpp.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Programozas", "c_cpp");
            }
            break;
        case setup.REACTION_ROLES.Programozas.CHANNELS.java.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Programozas", "java");
            }
            break;
        case setup.REACTION_ROLES.Programozas.CHANNELS.python.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Programozas", "python");
            }
            break;
        case setup.REACTION_ROLES.Programozas.CHANNELS.c_sharp.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Programozas", "c_sharp");
            }
            break;
        case setup.REACTION_ROLES.Programozas.CHANNELS.web.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Programozas", "web");
            }
            break;
        case setup.REACTION_ROLES.Programozas.CHANNELS.javascript.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRoleAdd("Programozas", "javascript");
            }
            break;
    }

    function reVerifyReactionRoleAdd(object) {
        reVerifyRoleAdd(setup.REACTION_ROLES.Ezek_erdekelnek.CHANNEL_ID, setup.REACTION_ROLES[object].MESSAGE_ID, setup.REACTION_ROLES[object].REACTION, user, setup.REACTION_ROLES[object].ROLE_ID, reaction)
    }
    function fetchReactionRolesReactions(object) {return fetchReactions(setup.REACTION_ROLES.Ezek_erdekelnek.CHANNEL_ID, setup.REACTION_ROLES[object].MESSAGE_ID, setup.REACTION_ROLES[object].REACTION, user);}
    async function roleAdd(object) {await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES[object].ROLE_ID);}
    async function interestRoleAdd(object, interest) {await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES[object].CHANNELS[interest].ROLE_ID);}
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
                        removeRole("GitHub_Team");
                        await reaction.message.guild.members.cache.get(user.id).roles.remove(personalRole(user));
                        if (teamSearch(user)) removeRoleByID(teamSearch(user));
                        genderSearch(reaction, user).then(result => {
                            if (result) reaction.message.guild.members.cache.get(user.id).roles.remove(result);
                        })
                        switch (languageSearch(user)) {
                            case "G":
                                removeRole("Nemet");
                                break;
                            case "F":
                                removeRole("Francia");
                                break;
                        }
                        switch (groupSearch(user)) {
                            case 1:
                                removeRole("G1");
                                break;
                            case 2:
                                removeRole("G2");
                                break;
                        }

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
                    interestReactionRoleReset("Gaming", "minecraft");
                    interestReactionRoleReset("Gaming", "paladins");
                    interestReactionRoleReset("Gaming", "rocket_league");
                    interestReactionRoleReset("Gaming", "pubg");
                    interestReactionRoleReset("Gaming", "csgo");
                    interestReactionRoleReset("Gaming", "r6s");
                    interestReactionRoleReset("Gaming", "among_us");
                    interestReactionRoleReset("Gaming", "fortnite");
                    interestReactionRoleReset("Gaming", "ark");
                    interestReactionRoleReset("Gaming", "fall_guys");
                    interestReactionRoleReset("Gaming", "gta");
                    interestReactionRoleReset("Gaming", "league_of_legends");
                    interestReactionRoleReset("Gaming", "lego");
                    interestReactionRoleReset("Gaming", "sim_racing");

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
                    interestReactionRoleReset("Programozas", "windows");
                    interestReactionRoleReset("Programozas", "mac");
                    interestReactionRoleReset("Programozas", "linux");
                    interestReactionRoleReset("Programozas", "git");
                    interestReactionRoleReset("Programozas", "c_cpp");
                    interestReactionRoleReset("Programozas", "java");
                    interestReactionRoleReset("Programozas", "python");
                    interestReactionRoleReset("Programozas", "c_sharp");
                    interestReactionRoleReset("Programozas", "web");
                    interestReactionRoleReset("Programozas", "javascript");

                }
            }
            break;

        case setup.REACTION_ROLES.Gaming.CHANNELS.sim_racing.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "sim_racing");
            }
            break;
    }
    switch (reaction.emoji.id) {
        case setup.REACTION_ROLES.Gaming.CHANNELS.minecraft.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "minecraft");
            }
            break;
        case setup.REACTION_ROLES.Gaming.CHANNELS.paladins.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "paladins");
            }
            break;
        case setup.REACTION_ROLES.Gaming.CHANNELS.rocket_league.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "rocket_league");
            }
            break;
        case setup.REACTION_ROLES.Gaming.CHANNELS.pubg.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "pubg");
            }
            break;
        case setup.REACTION_ROLES.Gaming.CHANNELS.csgo.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "csgo");
            }
            break;
        case setup.REACTION_ROLES.Gaming.CHANNELS.r6s.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "r6s");
            }
            break;
        case setup.REACTION_ROLES.Gaming.CHANNELS.among_us.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "among_us");
            }
            break;
        case setup.REACTION_ROLES.Gaming.CHANNELS.fortnite.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "fortnite");
            }
            break;
        case setup.REACTION_ROLES.Gaming.CHANNELS.ark.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "ark");
            }
            break;
        case setup.REACTION_ROLES.Gaming.CHANNELS.fall_guys.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "fall_guys");
            }
            break;
        case setup.REACTION_ROLES.Gaming.CHANNELS.gta.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "gta");
            }
            break;
        case setup.REACTION_ROLES.Gaming.CHANNELS.league_of_legends.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "league_of_legends");
            }
            break;
        case setup.REACTION_ROLES.Gaming.CHANNELS.lego.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Gaming.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Gaming", "lego");
            }
            break;
        case setup.REACTION_ROLES.Programozas.CHANNELS.windows.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Programozas", "windows");
            }
            break;
        case setup.REACTION_ROLES.Programozas.CHANNELS.mac.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Programozas", "mac");
            }
            break;
        case setup.REACTION_ROLES.Programozas.CHANNELS.linux.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Programozas", "linux");
            }
            break;
        case setup.REACTION_ROLES.Programozas.CHANNELS.git.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Programozas", "git");
            }
            break;
        case setup.REACTION_ROLES.Programozas.CHANNELS.c_cpp.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Programozas", "c_cpp");
            }
            break;
        case setup.REACTION_ROLES.Programozas.CHANNELS.java.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Programozas", "java");
            }
            break;
        case setup.REACTION_ROLES.Programozas.CHANNELS.python.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Programozas", "python");
            }
            break;
        case setup.REACTION_ROLES.Programozas.CHANNELS.c_sharp.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Programozas", "c_sharp");
            }
            break;
        case setup.REACTION_ROLES.Programozas.CHANNELS.web.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Programozas", "web");
            }
            break;
        case setup.REACTION_ROLES.Programozas.CHANNELS.javascript.EMOTE_ID:
            if (reaction.message.id === setup.REACTION_ROLES.Programozas.CHANNELS_MESSAGE_ID) {
                interestRemoveRole("Programozas", "javascript");
            }
            break;
    }
    async function removeRole(object) {await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES[object].ROLE_ID);}
    async function interestRemoveRole(object, interest) {await reaction.message.guild.members.cache.get(user.id).roles.remove(setup.REACTION_ROLES[object].CHANNELS[interest].ROLE_ID);}
    async function roleAdd(object) {await reaction.message.guild.members.cache.get(user.id).roles.add(setup.REACTION_ROLES[object].ROLE_ID);}
    function hasRole(object) {return reaction.message.guild.members.cache.get(user.id).roles.cache.has(setup.REACTION_ROLES[object].ROLE_ID)}
    function userFound() {return !!reaction.message.guild.members.cache.get(user.id);}
    function removeRoleByID(id) {reaction.message.guild.members.cache.get(user.id).roles.remove(id);}
    function interestReactionRoleReset(object, interest) {console.log(setup.REACTION_ROLES[object].CHANNELS_MESSAGE_ID); removeReaction(setup.REACTION_ROLES[object].CHANNELS_CHANNEL_ID, setup.REACTION_ROLES[object].CHANNELS_MESSAGE_ID, setup.REACTION_ROLES[object].CHANNELS[interest].EMOTE_ID, user);}


});
console.log("testMemberAdd");
bot.on('guildMemberAdd', member => {
    console.log(`m+ ${member.id} in class: ${!!isInThisClass(member)} bot: ${!!member.user.bot} guest: ${!!isGuest(member)}`);
    inappropriateGuild(member.guild);
    if (isInThisClass(member)) {
        const raw = setup.WELCOME_MESSAGE;
        const dm = raw.replace(setup.USER_NAME, `${member.user}`).replace(setup.SERVER_NAME, `${member.guild.name}`);
        member.send(dm);
        member.roles.add(setup.REACTION_ROLES.Unverified.ROLE_ID);
    } else if (member.user.bot) {
        member.roles.add(setup.REACTION_ROLES.Bot.ROLE_ID);
    } else if (isGuest(member)) {
        member.roles.add(setup.REACTION_ROLES.Vendeg.ROLE_ID);
    } else {
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

clock.on(`${setup.BIRTHDAY_NOTIFICATION_TIME.HOURS}:${setup.BIRTHDAY_NOTIFICATION_TIME.MINUTES}`, (date) => {
    now = new Date();
    birthday(now.getFullYear(), now.getMonth() + 1, now.getDate());
})

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let read;
let readChannel;
let readMessage;
rl.on('line', (input) => {
    read = input;
    readChannel = read.split(" ")[1];
    readMessage = replaceAll(read.split(" ").slice(2).join(' '), "\\\n", "\\n");
    switch(read.split(" ")[0]) {
        case "ch":
            bot.channels.fetch(readChannel).then(channel => {
                channel.send(readMessage);
            }).catch((channel) => console.error(channel));
            break;
        case "dm":
            bot.users.cache.get(readChannel).send(readMessage);
            break;
    }
});

bot.login(token);
