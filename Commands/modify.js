const Discord = require('discord.js');

module.exports = {
    name: 'modify',
    description: 'modifies a message sent by GYH BOT',
    admin : true,
    roles : [],
    guilds : [],
    async execute(message, args, setup){
        const embed = new Discord.MessageEmbed()

        //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
        .setDescription(`
${getChannel(setup.REACTION_CHANNELS.Spam.one_word_story_in_english)}
-*${getChannel(setup.REACTION_CHANNELS.Spam.one_word_story_in_english).topic}*
${getChannel(setup.REACTION_CHANNELS.Spam.comment_chat)}
-*${getChannel(setup.REACTION_CHANNELS.Spam.comment_chat).topic}*
${getChannel(setup.REACTION_CHANNELS.Spam.meme_szekcio)}
-*${getChannel(setup.REACTION_CHANNELS.Spam.meme_szekcio).topic}*
${getChannel(setup.REACTION_CHANNELS.Spam.null_width_space)}
-*${getChannel(setup.REACTION_CHANNELS.Spam.null_width_space).topic}*
:loud_sound: Projekt 1
:loud_sound: Projekt 2
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
            case "programozas":
                embed.setTitle("Programozas");
                messageID = setup.REACTION_ROLES.Programozas.MESSAGE_ID;
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

        function getChannel(id) {return message.guild.channels.cache.get(id);}
    }
}
