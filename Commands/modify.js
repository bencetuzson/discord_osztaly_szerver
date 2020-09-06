const Discord = require('discord.js');
const setup = require('../../database/setup.json');

module.exports = {
    name: 'modify',
    description: 'modifies a message sent by GYH BOT',
    async execute(message, args){
        const embed = new Discord.MessageEmbed()

        //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
        .setDescription(`
**Ha igen, kattints az ez alatt lévő :white_check_mark:-ra, és menj be az ${message.guild.channels.cache.get(setup.REACTION_ROLES.Ezek_erdekelnek.CHANNEL_ID)} csatornába!**
`)
        //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

        .setColor("RANDOM");
        var messageID;
        switch (args[1]) {
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
            case "ezek_erdekelnek":
                embed.setTitle("Minden kategóriát kiválasztottál, ami érdekel?");
                messageID = setup.REACTION_ROLES.Ezek_erdekelnek.MESSAGE_ID;
                break;
        
            default:
                console.log("error");
                break;
        }
        (await message.channel.messages.fetch({around: messageID, limit: 1})).first().edit(embed);
        console.log("done");
    }
}