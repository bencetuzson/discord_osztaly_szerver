const Discord = require('discord.js');

module.exports = {
    name: 'modify',
    description: 'modifies a message sent by GYH BOT',
    async execute(message, args, setup){
        const embed = new Discord.MessageEmbed()

        //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
        .setDescription(`
${getChannel(setup.REACTION_CHANNELS.Teszter.teszter)}
-*${getChannel(setup.REACTION_CHANNELS.Teszter.teszter).topic}*
${getChannel(setup.REACTION_CHANNELS.BOT.bot_info)}
-*${getChannel(setup.REACTION_CHANNELS.BOT.bot_info).topic}*
${getChannel(setup.REACTION_CHANNELS.BOT.bot_teszt_beallitas)}
-*${getChannel(setup.REACTION_CHANNELS.BOT.bot_teszt_beallitas).topic}*
${getChannel(setup.REACTION_CHANNELS.BOT.discord_js_update)}
-*${getChannel(setup.REACTION_CHANNELS.BOT.discord_js_update).topic}*
${getChannel(setup.REACTION_CHANNELS.BOT.szerverspecifikus_bot_update)}
-*${getChannel(setup.REACTION_CHANNELS.BOT.szerverspecifikus_bot_update).topic.replace("GYH Gimi 2019 BOT", message.guild.members.cache.get(setup.REACTION_CHANNELS.USERS.GYH_BOT))}*
__A tesztereknek az a feladatuk, hogy leteszteljék az új BOT-okat és az új fejlesztéseket, ami elvárás feléjük!__
`)
        //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

        .setColor("RANDOM");
        let messageID;
        switch (args[1].toLowerCase()) {
            case "intro":
                embed.setTitle("BOT");
                messageID = setup.REACTION_ROLES.BOT.MESSAGE_ID;
                break;
            case "rules":
                embed.setTitle("Gaming");
                messageID = setup.REACTION_ROLES.Gaming.MESSAGE_ID;
                break;
            case "bot":
                embed.setTitle("BOT");
                messageID = setup.REACTION_ROLES.BOT.MESSAGE_ID;
                break;
            case "gaming":
                embed.setTitle("Gaming");
                messageID = setup.REACTION_ROLES.Gaming.MESSAGE_ID;
                break;
            case "zene":
                embed.setTitle("Zene");
                messageID = setup.REACTION_ROLES.Zene.MESSAGE_ID;
                break;
            case "teszter":
                embed.setTitle("Teszter");
                messageID = setup.REACTION_ROLES.Teszter.MESSAGE_ID;
                break;
            case "spam":
                embed.setTitle("Spam");
                messageID = setup.REACTION_ROLES.Spam.MESSAGE_ID;
                break;
            case "verify":
                embed.setTitle(`Elfogadod az itt leírtakat?`);
                messageID = setup.REACTION_ROLES.Verified.MESSAGE_ID;
                break;
            case "done":
                embed.setTitle("Minden kategóriát kiválasztottál, ami érdekel?");
                messageID = setup.REACTION_ROLES.Ezek_erdekelnek.MESSAGE_ID;
                break;
            case "test":
                embed.setTitle("Test");
                messageID = setup.REACTION_ROLES.Gaming.MESSAGE_ID;
                break;
            default:
                console.error("Invalid parameter!");
                break;
        }
        await message.channel.messages.fetch(messageID).then(msg => msg.edit(embed));
        console.log("done");

        function getChannel(id) {return message.guild.channels.cache.get(id);}
    }
}