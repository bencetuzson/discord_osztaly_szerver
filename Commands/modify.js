const Discord = require('discord.js');
const setup = require('../../database/setup.json');

module.exports = {
    name: 'modify',
    description: 'modifies a message sent by GYH BOT',
    async execute(message, args){
        const embed = new Discord.MessageEmbed()

        //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
        .setDescription(`
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Gaming.minecraft)} 
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Gaming.minecraft).topic}*
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Gaming.among_us)}
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Gaming.among_us).topic}*
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Gaming.rocket_league)}
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Gaming.rocket_league).topic}*
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Gaming.paladins)} 
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Gaming.paladins).topic}*
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Gaming.pubg)} 
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Gaming.pubg).topic}*
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Gaming.csgo)} 
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Gaming.csgo).topic}*
${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Gaming.r6s)} 
-*${message.guild.channels.cache.get(setup.REACTION_CHANNELS.Gaming.r6s).topic}*
:loud_sound: #1
:loud_sound: #2
:loud_sound: #3
:loud_sound: #4
`)
        //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

        .setColor("RANDOM");
        var messageID;
        switch (args[1].toLowerCase()) {
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
                console.error("Invalid parameter!");
                break;
        }
        (await message.channel.messages.fetch({around: messageID, limit: 1})).first().edit(embed);
        console.log("done");
    }
}