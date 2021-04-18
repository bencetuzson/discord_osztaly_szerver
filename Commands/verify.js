const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'verify',
    description: 'for the verify channel',
    admin : true,
    roles : [],
    guilds : [],
    async execute(message, args, setup, bot){
        let title = "";
        let description = "";
        let reactEmoji = '';
        let argsSuccess = false;
        let inJSON;
        let msgId;
        let multiEmoji;
        const path = "../database/setup.json";
            switch (args[1]) {
                case "intro":
                    inJSON = "Intro";
                    title = "Ezek érdekelnek";
                    description = "**Itt vannak azok a kategóriák és a hozzájuk tartozó csatornák, amik a lenn lévő opcióknál vannak.**\n\n__Amelyik kategóriák érdekelnek, nyomj rá az azok alatt lévő gombra! Ha esetleg nem érdekel többé az egyik kategória, azt az alatta lévő gomb újra megnyomásával tudod deaktiválni.__";
                    argsSuccess = true;
                    multiEmoji = false;
                    break;
                case "rules":
                    inJSON = "Rules";
                    title = "Ha elolvastad, és elfogadod az itt leírtakat";
                    description = `**menj be a ${getChannel(setup.REACTION_ROLES.Verified.CHANNEL_ID)} csatornába (vagy nyomj rá a \`#verify\`-ra!)**`;
                    argsSuccess = true;
                    multiEmoji = false;
                    break;
                case "bot":
                    inJSON ="BOT";
                    title = "BOT";
                    description = `
${getChannel(setup.REACTION_CHANNELS.BOT.bot)} 
-*${getChannel(setup.REACTION_CHANNELS.BOT.bot).topic}*
${getChannel(setup.REACTION_CHANNELS.BOT.bot_parancsok)}
-*${getChannel(setup.REACTION_CHANNELS.BOT.bot_parancsok).topic}*
${getChannel(setup.REACTION_CHANNELS.BOT.boxbot_szoba)} 
-*${getChannel(setup.REACTION_CHANNELS.BOT.boxbot_szoba).topic}*
${getChannel(setup.REACTION_CHANNELS.BOT.idlerpg_szoba)}
-*${getChannel(setup.REACTION_CHANNELS.BOT.idlerpg_szoba).topic}*
${getChannel(setup.REACTION_CHANNELS.BOT.pokecord)}
-*${getChannel(setup.REACTION_CHANNELS.BOT.pokecord).topic}*
${getChannel(setup.REACTION_CHANNELS.BOT.cleverbot)}
-*${getChannel(setup.REACTION_CHANNELS.BOT.cleverbot).topic}*
                    `;
                    reactEmoji = setup.REACTION_ROLES.BOT.REACTION;
                    argsSuccess = true;
                    multiEmoji = false;
                    break;
                case "gaming":
                    inJSON = "Gaming";
                    title = "Gaming";
                    description = `
${getChannel(setup.REACTION_CHANNELS.Gaming.minecraft)} 
-*${getChannel(setup.REACTION_CHANNELS.Gaming.minecraft).topic}*
${getChannel(setup.REACTION_CHANNELS.Gaming.among_us)}
-*${getChannel(setup.REACTION_CHANNELS.Gaming.among_us).topic}*
${getChannel(setup.REACTION_CHANNELS.Gaming.rocket_league)}
-*${getChannel(setup.REACTION_CHANNELS.Gaming.rocket_league).topic}*
${getChannel(setup.REACTION_CHANNELS.Gaming.paladins)} 
-*${getChannel(setup.REACTION_CHANNELS.Gaming.paladins).topic}*
${getChannel(setup.REACTION_CHANNELS.Gaming.pubg)} 
-*${getChannel(setup.REACTION_CHANNELS.Gaming.pubg).topic}*
${getChannel(setup.REACTION_CHANNELS.Gaming.csgo)} 
-*${getChannel(setup.REACTION_CHANNELS.Gaming.csgo).topic}*
${getChannel(setup.REACTION_CHANNELS.Gaming.r6s)} 
-*${getChannel(setup.REACTION_CHANNELS.Gaming.r6s).topic}*
:loud_sound: #1
:loud_sound: #2
:loud_sound: #3
:loud_sound: #4
                    `;
                    reactEmoji = setup.REACTION_ROLES.Gaming.REACTION;
                    argsSuccess = true;
                    multiEmoji = false;
                    break;
                case "zene":
                    inJSON = "Zene";
                    title = "Zene";
                    description = `
${getChannel(setup.REACTION_CHANNELS.Zene.zene)}
-*${getChannel(setup.REACTION_CHANNELS.Zene.zene).topic}*
:loud_sound: Zene hallgatós csatorna
                    `;
                    reactEmoji = setup.REACTION_ROLES.Zene.REACTION;
                    argsSuccess = true;
                    multiEmoji = false;
                    break;
                case "teszter":
                    inJSON = "Teszter";
                    title = "Teszter";
                    description = `
${getChannel(setup.REACTION_CHANNELS.Teszter.teszter)}
-*${getChannel(setup.REACTION_CHANNELS.Teszter.teszter).topic}*
${getChannel(setup.REACTION_CHANNELS.BOT.bot_info)}
-*${getChannel(setup.REACTION_CHANNELS.BOT.bot_info).topic}*
${getChannel(setup.REACTION_CHANNELS.BOT.bot_teszt_beallitas)}
-*${getChannel(setup.REACTION_CHANNELS.BOT.bot_teszt_beallitas).topic}*
${getChannel(setup.REACTION_CHANNELS.BOT.discord_js_update)}
-*${getChannel(setup.REACTION_CHANNELS.BOT.discord_js_update).topic}*
${getChannel(setup.REACTION_CHANNELS.BOT.szerverspecifikus_bot_update)}
-*${getChannel(setup.REACTION_CHANNELS.BOT.szerverspecifikus_bot_update).topic}*
__A tesztereknek az a feladatuk, hogy leteszteljék az új BOT-okat és az új fejlesztéseket, ami elvárás feléjük!__
                    `;
                    reactEmoji = setup.REACTION_ROLES.Teszter.REACTION;
                    argsSuccess = true;
                    multiEmoji = false;
                    break;
                case "spam":
                    inJSON = "Spam";
                    title = "Spam";
                    description = `
${getChannel(setup.REACTION_CHANNELS.Spam.one_word_story_in_english)}
-*${getChannel(setup.REACTION_CHANNELS.Spam.one_word_story_in_english).topic}*
${getChannel(setup.REACTION_CHANNELS.Spam.comment_chat)}
-*${getChannel(setup.REACTION_CHANNELS.Spam.comment_chat).topic}*
${getChannel(setup.REACTION_CHANNELS.Spam.meme_szekcio)}
-*${getChannel(setup.REACTION_CHANNELS.Spam.meme_szekcio).topic}*
${getChannel(setup.REACTION_CHANNELS.Spam.null_width_space)}
-*${getChannel(setup.REACTION_CHANNELS.Spam.null_width_space).topic}*
                    `;
                    reactEmoji = setup.REACTION_ROLES.Spam.REACTION;
                    argsSuccess = true;
                    multiEmoji = false;
                    break;
                case "programozas":
                    inJSON ="Programozas";
                    title = "Programozás";
                    description = `
${getChannel(setup.REACTION_CHANNELS.PROGRAMOZAS.windows)} 
-*${getChannel(setup.REACTION_CHANNELS.PROGRAMOZAS.windows).topic}*
${getChannel(setup.REACTION_CHANNELS.PROGRAMOZAS.mac)}
-*${getChannel(setup.REACTION_CHANNELS.PROGRAMOZAS.mac).topic}*
${getChannel(setup.REACTION_CHANNELS.PROGRAMOZAS.linux)} 
-*${getChannel(setup.REACTION_CHANNELS.PROGRAMOZAS.linux).topic}*
${getChannel(setup.REACTION_CHANNELS.PROGRAMOZAS.git)} 
-*${getChannel(setup.REACTION_CHANNELS.PROGRAMOZAS.git).topic}*
${getChannel(setup.REACTION_CHANNELS.PROGRAMOZAS.c_cpp)}
-*${getChannel(setup.REACTION_CHANNELS.PROGRAMOZAS.c_cpp).topic}*
${getChannel(setup.REACTION_CHANNELS.PROGRAMOZAS.java)}
-*${getChannel(setup.REACTION_CHANNELS.PROGRAMOZAS.java).topic}*
${getChannel(setup.REACTION_CHANNELS.PROGRAMOZAS.python)}
-*${getChannel(setup.REACTION_CHANNELS.PROGRAMOZAS.python).topic}*
${getChannel(setup.REACTION_CHANNELS.PROGRAMOZAS.c_sharp)}
-*${getChannel(setup.REACTION_CHANNELS.PROGRAMOZAS.c_sharp).topic}*
${getChannel(setup.REACTION_CHANNELS.PROGRAMOZAS.html)}
-*${getChannel(setup.REACTION_CHANNELS.PROGRAMOZAS.html).topic}*
${getChannel(setup.REACTION_CHANNELS.PROGRAMOZAS.javascript)}
-*${getChannel(setup.REACTION_CHANNELS.PROGRAMOZAS.javascript).topic}*
${getChannel(setup.REACTION_CHANNELS.PROGRAMOZAS.css)}
-*${getChannel(setup.REACTION_CHANNELS.PROGRAMOZAS.css).topic}*
:loud_sound: Projekt 1
:loud_sound: Projekt 2
                    `;
                    reactEmoji = setup.REACTION_ROLES.Programozas.REACTION;
                    argsSuccess = true;
                    multiEmoji = false;
                    break;
                case "done":
                    inJSON = "Ezek_erdekelnek";
                    title = "Minden kategóriát kiválasztottál, ami érdekel?";
                    description = "**Ha igen, Kattints az ez alatt lévő :ballot_box_with_check:-ra!**";
                    reactEmoji = setup.REACTION_ROLES.Ezek_erdekelnek.REACTION;
                    argsSuccess = true;
                    multiEmoji = false;
                    break;
                case "verify":
                    inJSON = "Verify";
                    title = `Elfogadod az itt leírtakat?`;
                    description = `**Ha igen, kattints az ez alatt lévő :white_check_mark:-ra, és menj be az ${getChannel(setup.REACTION_ROLES.Ezek_erdekelnek.CHANNEL_ID)} csatornába!**`;
                    reactEmoji = setup.REACTION_ROLES.Verified.REACTION;
                    argsSuccess = true;
                    multiEmoji = false;
                    break;
                case "test":
                    inJSON = "Test"
                    title = "Title";
                    description = "Description";
                    argsSuccess = true;
                    multiEmoji = false;
                    break;


                case "iprogramozas":
                    inJSON = "Programozas"
                    title = "Ezek közül melyeket használod?";
                    description = "";
                    reactEmoji = [];
                    for (const [key, value] of Object.entries(setup.REACTION_ROLES.Programozas.CHANNELS)) {description += `${value.CUSTOM_EMOTE ? bot.emojis.cache.get(value.EMOTE_ID) : value.EMOTE_ID}: ${value.NAME}\n`; reactEmoji.push(value.EMOTE_ID)};
                    argsSuccess = true;
                    multiEmoji = true;
                    break;
                case "igaming":
                    inJSON = "Gaming"
                    title = "Ezek közül melyekkel játszol?";
                    description = "";
                    reactEmoji = [];
                    for (const [key, value] of Object.entries(setup.REACTION_ROLES.Gaming.CHANNELS)) {description += `${value.CUSTOM_EMOTE ? bot.emojis.cache.get(value.EMOTE_ID) : value.EMOTE_ID}: ${value.NAME}\n`; reactEmoji.push(value.EMOTE_ID)};
                    argsSuccess = true;
                    multiEmoji = true;
                    break;

        }
        if(argsSuccess){
            const embed = new Discord.MessageEmbed()
                .setTitle(title)
                .setDescription(description)
                .setColor('RANDOM');
            let msgEmbed = await message.channel.send(embed);
            if (reactEmoji) {
                if (!multiEmoji) {
                    msgEmbed.react(reactEmoji);
                    msgId = setup.REACTION_ROLES[inJSON].MESSAGE_ID;
                } else {
                    for (const [key, value] of Object.entries(reactEmoji)) {
                        msgEmbed.react(bot.emojis.cache.get(value));
                    }
                    msgId = setup.REACTION_ROLES[inJSON].CHANNELS_MESSAGE_ID;
                }
            }
            await fs.readFile(path, 'utf8', function (err,data) {
            if (err) return console.log(err);
            const result = data.replace(msgId, msgEmbed.id);
            fs.writeFile(path, result, 'utf8', function (err) {
                if (err) return console.log(err);
            });
        });
        } else {
            message.channel.send("Érvénytelen paraméter!");
        }

        function getChannel(id) {return message.guild.channels.cache.get(id);}
    }
}
