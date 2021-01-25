const Discord = require('discord.js');

module.exports = {
    name: 'szin',
    description: 'changes the author\'s personal role\'s colour',
    admin : false,
    roles : [],
    guilds : [],
    execute(message, args, users, database){
        const colours = database.COLOURS;
        for (let index = 0; index < users.USERS.length; index++) {
            if (users.USERS[index].USER_ID === message.member.user.id) {
                switch (args.length) {
                    case 2:
                        const custom_colour = isCustomColour(args[1]);
                        if (custom_colour) {
                            setColor(custom_colour);
                        } else {
                            setColor(args[1].toUpperCase());
                        }
                        break;
                    case 3:
                        if (args[1] === "test") {
                            const Embed = new Discord.MessageEmbed()
                                .setTitle("Szín teszt")
                                .setDescription(args[2].toUpperCase());
                            const custom_colour = isCustomColour(args[2]);
                            if (custom_colour) {
                                Embed.setColor(custom_colour);
                            } else {
                                Embed.setColor(args[2].toUpperCase());
                            }
                            message.channel.send(Embed);
                        }
                        break;
                    case 4:
                        setColor(rgbToHex(args[1], args[2], args[3]));
                        break;
                    case 5:
                        if (args[1] === "test") {
                            const Embed = new Discord.MessageEmbed()
                                .setTitle("Szín teszt")
                                .setDescription(`${args[2]}, ${args[3]}, ${args[4]}`)
                                .setColor(rgbToHex(args[2], args[3], args[4]));
                            message.channel.send(Embed);
                        }
                        break;
                    default:
                        message.channel.send("Érvénytelen paraméter!");
                        break;

                }

                function setColor(color) {
                    message.guild.roles.cache.find(r => r.id === users.USERS[index].ROLE_ID).edit({color: color});
                }

                function componentToHex(c) {
                    let hex = Number(c).toString(16);
                    console.log(hex);
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