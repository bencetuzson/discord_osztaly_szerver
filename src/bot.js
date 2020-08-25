const discord = require('discord.js');
const client = new discord.Client();
const config = require('../config/config.json');

client.login(config.TOKEN);

client.on('ready', () => {
	console.log(client.user.tag + " has logged in.");
})