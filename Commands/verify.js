const Discord = require('discord.js');
const setup = require("../../database/setup.json")

module.exports = {
    name: 'verify',
    description: 'for the verify channel',
    async execute(message, args){
        let title = "";
        let description = "";
        let reactEmoji = '';
        let argsSuccess = false;
        switch (args[1]) {
            case "intro":
                title = "Ezek érdekelnek";
                description = "**Itt vannak azok a kategóriák és a hozzájuk tartozó csatornák, amik a lenn lévő opcióknál vannak.**\n\n__Amelyik kategóriák érdekelnek, nyomj rá az azok alatt lévő gombra! Ha esetleg nem érdekel többé az egyik kategória, azt az alatta lévő gomb újra megnyomásával tudod deaktiválni.__";
                argsSuccess = true;
                break;
            case "rules":
                title = "Ha elolvastad, és elfogadod az itt leírtakat";
                description = `**menj be a ${message.guild.channels.cache.get(setup.REACTION_ROLES.Verified.CHANNEL_ID)} csatornába (vagy nyomj rá a \`#verify\`-ra!)**`;
                argsSuccess = true;
                break;
            case "bot":
                title = "BOT";
                description = `
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.BOT.bot)} 
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.BOT.bot).topic}*
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.BOT.bot_parancsok)}
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.BOT.bot_parancsok).topic}*
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.BOT.bot_info)} (csak ${message.guild.roles.cache.get(setup.REACTION_ROLES.Teszter.ROLE_ID)})
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.BOT.bot_info).topic}*
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.BOT.boxbot_szoba)} 
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.BOT.boxbot_szoba).topic.replace("BoxBot", message.guild.members.cache.get(setup.REACTION_CHANNELS.USERS.BoxBot))}*
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.BOT.idlerpg_szoba)}
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.BOT.idlerpg_szoba).topic.replace("IdleRPG", message.guild.members.cache.get(setup.REACTION_CHANNELS.USERS.IdleRPG))}*
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.BOT.pokecord)}
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.BOT.pokecord).topic.replace("Pokécord", message.guild.members.cache.get(setup.REACTION_CHANNELS.USERS.Pokecord))}*
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.BOT.chat_with_cathy)}
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.BOT.chat_with_cathy).topic.replace("Cathy", message.guild.members.cache.get(setup.REACTION_CHANNELS.USERS.Cathy))}*
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.BOT.bot_teszt_beallitas)} (csak ${message.guild.roles.cache.get(setup.REACTION_ROLES.Teszter.ROLE_ID)})
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.BOT.bot_teszt_beallitas).topic}*
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.BOT.szerverspecifikus_bot_update)} (csak ${message.guild.roles.cache.get(setup.REACTION_ROLES.Teszter.ROLE_ID)})
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.BOT.szerverspecifikus_bot_update).topic.replace("GYH Gimi 2019 BOT", message.guild.members.cache.get(setup.REACTION_CHANNELS.USERS.GYH_BOT))}*
                `;
                reactEmoji = setup.REACTION_ROLES.BOT.REACTION;
                argsSuccess = true;
                break;
            case "gaming":
                title = "Gaming";
                description = `
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Gaming.minecraft)} 
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Gaming.minecraft).topic}*
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Gaming.paladins)} 
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Gaming.paladins).topic}*
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Gaming.rocket_league)}
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Gaming.rocket_league).topic}*
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Gaming.pubg)} 
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Gaming.pubg).topic}*
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Gaming.r6s)} 
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Gaming.r6s).topic}*
:loud_sound: #1
:loud_sound: #2
:loud_sound: #3
:loud_sound: #4
                `;
                reactEmoji = setup.REACTION_ROLES.Gaming.REACTION;
                argsSuccess = true;
                break;
            case "zene":
                title = "Zene";
                description = `
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Zene.zene)}
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Zene.zene).topic}*
:loud_sound: Zene hallgatós csatorna
                `;
                reactEmoji = setup.REACTION_ROLES.Zene.REACTION;
                argsSuccess = true;
                break;
            case "teszter":
                title = "Teszter";
                description = `
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Teszter.teszter)}
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Teszter.teszter).topic}*
__A tesztereknek az a feladatuk, hogy leteszteljék az új BOT-okat és az új fejlesztéseket, ami elvárás feléjük!__
                `;
                reactEmoji = setup.REACTION_ROLES.Teszter.REACTION;
                argsSuccess = true;
                break;
            case "spam":
                title = "Spam";
                description = `
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Spam.one_word_story_in_english)}
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Spam.one_word_story_in_english).topic}*
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Spam.comment_chat)}
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Spam.comment_chat).topic}*
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Spam.meme_szekcio)}
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Spam.meme_szekcio).topic}*
                `;
                reactEmoji = setup.REACTION_ROLES.Spam.REACTION;
                argsSuccess = true;
                break;
            case "done":
                title = "Minden kategóriát kiválasztottál, ami érdekel?";
                description = "**Ha igen, Kattints az ez alatt lévő :ballot_box_with_check:-ra!**";
                reactEmoji = setup.REACTION_ROLES.Ezek_erdekelnek.REACTION;
                argsSuccess = true;
                break;
            case "verify":
                title = `Elfogadod az itt leírtakat?`;
                description = `**Ha igen, kattints az ez alatt lévő :white_check_mark:-ra, és menj be az ${message.guild.channels.cache.get(setup.REACTION_ROLES.Ezek_erdekelnek.CHANNEL_ID)} csatornába!**`;
                reactEmoji = setup.REACTION_ROLES.Verified.REACTION;
                argsSuccess = true;
                break;
            case "test":
                title = "Title";
                description = "Description";
                argsSuccess = true;
                break;
        }
        if(argsSuccess){
            const embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setDescription(description)
            .setColor('RANDOM');
            let msgEmbed = await message.channel.send(embed);
            msgEmbed.react(reactEmoji);
        } else {
            message.channel.send("Érvénytelen paraméter!");
        }
    }
}