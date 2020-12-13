console.log("Starting up...");

const Discord = require('discord.js');
const bot = new Discord.Client({
    partials: ['USER', 'GUILD_MEMBER', 'CHANNEL', 'MESSAGE', 'REACTION']
});
let setup = require('../database/setup.json');
let config = require(setup.CONFIG_PATH);
let token = config.TEST.TOKEN;
let users = require(setup.USERS_PATH);
let prefix = config.MAIN.PREFIX;
let database = require(setup.DATABASE_PATH);
let timetable = require(setup.TIMETABLE_PATH);
const childProcess = require('child_process');
const fs = require('fs');
const {set} = require('mongoose');
const {userInfo} = require('os');
/*runScript(setup.STATUS_PATH, function (err) {
    if (err) throw err;
    console.log('finished running some-script.js');
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
    bot.user.setActivity(setup.STATUS, {type: setup.ACTIVITY});
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

bot.on('message', async (message, user) => {
    console.log("message");
    //console.log(message.author === bot.user);
    //console.log(message.channel)
    //message.react("❤")
    function hasAdmin() {
        return message.member.hasPermission("ADMINISTRATOR")
    }

    beSent = "";
    replyTemp = [];
    remoteMsg = message;
    if (message.author.bot) return;
    let args = message.content.split(' ');
    let requiredPrefix = message.guild === null ? "" : prefix;

    switch (args[0].toLowerCase()) {
        case `${requiredPrefix}szin`:
            bot.commands.get('szin').execute(await message, args, users, database);
            break;
    }
});

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

bot.login(token);