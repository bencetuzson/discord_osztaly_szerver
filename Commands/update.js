const Discord = require('discord.js');

module.exports = {
    name: 'update',
    description: 'updates the commands',
    async execute(interaction, args, setup, slash_commands, bot) {
        bot.api.applications(bot.user.id).guilds(setup.GUILD_ID).commands.get().then(commands => {
            commands.forEach(c => {
                let foundCommand = slash_commands.find(sc => sc.name === c.name);
                if (!foundCommand) {
                    bot.api.applications(bot.user.id).guilds(setup.GUILD_ID).commands(c.id).delete();
                }
            })
        })
        for (let i = 0; i < slash_commands.length; i++) {
            await bot.api.applications(bot.user.id).guilds(setup.GUILD_ID).commands.post({
                data: slash_commands[i]
            });
        }
    }
}
