const Discord = require('discord.js');
const bot = new Discord.Client({
    partials: ['USER', 'GUILD_MEMBER', 'CHANNEL', 'MESSAGE', 'REACTION']
});
let setup = require('../database/setup.json');
let token = require(setup.CONFIG_PATH).STATUS.TOKEN;
let fs = require('fs');
var childProcess = require('child_process');
runScript(setup.WARN_PATH, function (err) {
    if (err) throw err;
    console.log('finished running some-script.js');
});

bot.on('ready', () => {console.log("ready")});

bot.on('presenceUpdate', async (oldPresence, newPresence) => {
    console.log(newPresence.member.displayName)
    if (newPresence.member.id === setup.BOT_ID && oldPresence.status !== newPresence.status && newPresence.status === "offline") {
        await script.runInNewContext();
        bot.destroy();
    }
});

setInterval(function () {
    console.log("YEET");
}, 1000);

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

bot.login(token);