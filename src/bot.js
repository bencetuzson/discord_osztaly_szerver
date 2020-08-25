const discord = require('discord.js');
const client = new discord.Client({
	partials: ['MESSAGE']
});
const config = require('../config/config.json');

client.login(config.TOKEN);

client.on('ready', () => {
	console.log(client.user.tag + " has logged in.");
	client.user.setActivity(config.STATUS, {type: "LISTENING"});
	//const channel = client.channels.cache.get('633722557618454567');
	//channel.send('test');
});

//client.on("guildMemberAdd", member => {
//
//});

client.on('message', message => {
	//if (message.content === '!react') {
	//	message.react('👍');
	//}
	msg = message.content.toLowerCase();
	var mess = msg.replace('!colour ', '');
	console.log(mess);
	var hex = parseInt(mess, 16);
	console.log(hex);
	if (msg.startsWith("!colour")) {
		if(hex > 0x000000 || hex < 0xffffff) {
			message.guild.createRole({
				data: {
				name: message,
				color: message,
				},
				reason: null,
			});	
			console.log(message.content);
		}
	}
});

client.on('messageReactionAdd', (reaction, user) => {
	console.log(reaction.emoji.name + user);
	//let role = message.guild.roles.find(r => r.name === reaction);
	//let member = message.mentions.members.first();
	//user.roles.add(reaction);
	/*if(reaction.message.partial){
		let msg = await reaction.message.fetch();
		console.log(msg.content);
		console.log('Partial');
	} else {
		console.log("Not a partial")
	}*/
});

client.on('roleUpdate', (role) => {
	console.log(role);
});