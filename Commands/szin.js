const Discord = require('discord.js');

module.exports = {
    name: 'szin',
    description: 'changes the author\'s personal role\'s colour',
    admin : false,
    roles : [],
    guilds : [],
    execute(interaction, args, users, database, bot){
        const colours = database.COLOURS;
        for (let index = 0; index < users.USERS.length; index++) {
            if (users.USERS[index].USER_ID === interaction.member.user.id) {
                switch (args[0].name) {
                    case "név":
                        const custom_colour = isCustomColour(args[0].options[0].value);
                        if (custom_colour) {
                            if (args[0].options[1].value) {
                                let Embed = new Discord.MessageEmbed()
                                    .setTitle("Szín teszt")
                                    .setDescription(args[0].options[0].value)
                                    .setColor(custom_colour);
                                bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
                                    embeds: [Embed]
                                }}});
                            } else {
                                setColor(custom_colour);
                                bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
                                    content: `A színed átállítva erre: ${args[0].options[0].value}`
                                }}});
                            }
                        } else {
                            bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
                                content: "Érvénytelen szín!"
                            }}});
                        }
                        break;
                    case "hex":
                        let colour = args[0].options[0].value.replace("#", "");
                        if (colour.length === 6 && new RegExp("^[0-9a-eA-E]+$").test(colour)) {
                            colour = parseInt(colour, 16);
                            if (0 <= colour && colour <= 256^3 - 1) {
                                if (args[0].options[1].value) {
                                    let Embed = new Discord.MessageEmbed()
                                        .setTitle("Szín teszt")
                                        .setDescription(args[0].options[0].value)
                                        .setColor(colour);
                                    bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
                                        embeds: [Embed]
                                    }}});
                                } else {
                                    setColor(colour);
                                    bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
                                        content: `A színed átállítva erre: ${args[0].options[0].value}`
                                    }}});
                                }
                                return;
                            }
                        }
                        bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
                            content: "Érvénytelen szín!"
                        }}});
                        break;
                    case "rgb":
                        for (let i = 0; i < 3; i++) {
                            let colour = args[0].options[i].value;
                            if (!(0 <= colour && colour <= 255)) {
                                bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
                                    content: "Érvénytelen szín!"
                                }}});
                                return;
                            }
                        }
                        if (args[0].options[3].value) {
                            let Embed = new Discord.MessageEmbed()
                                .setTitle("Szín teszt")
                                .setDescription(`${args[0].options[0].value}, ${args[0].options[1].value}, ${args[0].options[2].value}`)
                                .setColor(rgbToHex(args[0].options[0].value, args[0].options[1].value, args[0].options[2].value));
                            bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
                                embeds: [Embed]
                            }}});
                        } else {
                            setColor(rgbToHex(args[0].options[0].value, args[0].options[1].value, args[0].options[2].value));
                            bot.api.interactions(interaction.id, interaction.token).callback.post({data: { type: 4, data: {
                                content: `A színed átállítva erre: ${args[0].options[0].value}, ${args[0].options[1].value}, ${args[0].options[2].value}`
                            }}});
                        }
                        break;
                }

                function setColor(color) {
                    bot.guilds.cache.get(interaction.guild_id).roles.cache.find(r => r.id === users.USERS[index].ROLE_ID).edit({color: color});
                }

                function componentToHex(c) {
                    let hex = Number(c).toString(16);
                    return hex.length === 1 ? "0" + hex : hex;
                }

                function rgbToHex(r, g, b) {
                    return componentToHex(r) + componentToHex(g) + componentToHex(b);
                }

                function isCustomColour(str) {
                    for (let i = 0; i < colours.length; ++i) {
                        if (str.toUpperCase() === colours[i].NAME.toUpperCase()) return colours[i].HEX;
                    }
                }
            }
        }
    }
}
