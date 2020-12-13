const Discord = require('discord.js');

module.exports = {
    name: 'modify',
    description: 'modifies a message sent by GYH BOT',
    async execute(message, args, setup){
        const embed = new Discord.MessageEmbed()

        //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
        .setDescription(`
${getChannel(setup.REACTION_CHANNELS.BOT.bot)} 
-*${getChannel(setup.REACTION_CHANNELS.BOT.bot).topic}*
${getChannel(setup.REACTION_CHANNELS.BOT.bot_parancsok)}
-*${getChannel(setup.REACTION_CHANNELS.BOT.bot_parancsok).topic}*
${getChannel(setup.REACTION_CHANNELS.BOT.bot_info)} (csak ${message.guild.roles.cache.get(setup.REACTION_ROLES.Teszter.ROLE_ID)})
-*${getChannel(setup.REACTION_CHANNELS.BOT.bot_info).topic}*
${getChannel(setup.REACTION_CHANNELS.BOT.boxbot_szoba)} 
-*${getChannel(setup.REACTION_CHANNELS.BOT.boxbot_szoba).topic.replace("BoxBot", message.guild.members.cache.get(setup.REACTION_CHANNELS.USERS.BoxBot))}*
${getChannel(setup.REACTION_CHANNELS.BOT.idlerpg_szoba)}
-*${getChannel(setup.REACTION_CHANNELS.BOT.idlerpg_szoba).topic.replace("IdleRPG", message.guild.members.cache.get(setup.REACTION_CHANNELS.USERS.IdleRPG))}*
${getChannel(setup.REACTION_CHANNELS.BOT.pokecord)}
-*${getChannel(setup.REACTION_CHANNELS.BOT.pokecord).topic.replace("Pokécord", message.guild.members.cache.get(setup.REACTION_CHANNELS.USERS.Pokecord))}*
${getChannel(setup.REACTION_CHANNELS.BOT.chat_with_cathy)}
-*${getChannel(setup.REACTION_CHANNELS.BOT.chat_with_cathy).topic.replace("Cathy", message.guild.members.cache.get(setup.REACTION_CHANNELS.USERS.Cathy))}*
${getChannel(setup.REACTION_CHANNELS.BOT.bot_teszt_beallitas)} (csak ${message.guild.roles.cache.get(setup.REACTION_ROLES.Teszter.ROLE_ID)})
-*${getChannel(setup.REACTION_CHANNELS.BOT.bot_teszt_beallitas).topic}*
${getChannel(setup.REACTION_CHANNELS.BOT.discord_js_update)} (csak ${message.guild.roles.cache.get(setup.REACTION_ROLES.Teszter.ROLE_ID)})
-*${getChannel(setup.REACTION_CHANNELS.BOT.discord_js_update).topic}*
${getChannel(setup.REACTION_CHANNELS.BOT.szerverspecifikus_bot_update)} (csak ${message.guild.roles.cache.get(setup.REACTION_ROLES.Teszter.ROLE_ID)})
-*${getChannel(setup.REACTION_CHANNELS.BOT.szerverspecifikus_bot_update).topic.replace("GYH Gimi 2019 BOT", message.guild.members.cache.get(setup.REACTION_CHANNELS.USERS.GYH_BOT))}*
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