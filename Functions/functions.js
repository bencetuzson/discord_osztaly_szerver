module.exports = {
msgLC : function (args){
    msgArgs = args;
    //console.log(args.content.toLowerCase());
    return args.content.toLowerCase();
},

noPrefix : function (message, args) {
    return message.content.toLowerCase().includes(args);
},
//console.log(setup.GENDER_ROLES.length);
//,console.log(setup.GENDER_ROLES[0].USER_ID);

genderSearch : function (reaction, user) {
    for (let index = 0; index < setup.GENDER_ROLES.length; index++) {
        //console.log(user.id);
        //console.log(setup.GENDER_ROLES[index].USER_ID);
        if (setup.GENDER_ROLES[index].USER_ID == user.id) {
            return setup.GENDER_ROLES[index].ROLE_ID;
        }
        
    }
},

nicknameSearch : function (reaction, user) {
    for (let index = 0; index < setup.GENDER_ROLES.length; index++) {
        //console.log(user.id);
        //console.log(setup.GENDER_ROLES[index].USER_ID);
        if (setup.GENDER_ROLES[index].USER_ID == user.id) {
            return setup.GENDER_ROLES[index].USER_NAME;
        }
        
    }
},

moderatorSearch : function (reaction, user) {
    for (let index = 0; index < setup.GENDER_ROLES.length; index++) {
        //console.log(user.id);
        //console.log(setup.GENDER_ROLES[index].USER_ID);
        if (setup.GENDER_ROLES[index].USER_ID == user.id) {
            return setup.GENDER_ROLES[index].MODERATOR;
        }
        
    }
},

birthdate : function (year, month, day) {
    let birthdays = [];
    for (let index = 0; index < setup.GENDER_ROLES.length; index++) {
        //console.log(user.id);
        //console.log(setup.GENDER_ROLES[index].USER_ID);
        console.log(setup.GENDER_ROLES[index].BIRTHDAY.YEAR);
        console.log(setup.GENDER_ROLES[index].BIRTHDAY.MONTH);
        console.log(setup.GENDER_ROLES[index].BIRTHDAY.DAY);
        console.log(year);
        console.log(month);
        console.log(day);
        if (setup.GENDER_ROLES[index].BIRTHDAY.MONTH == month && setup.GENDER_ROLES[index].BIRTHDAY.DAY == day) {
            console.log("HBD");
            birthdays.push(setup.GENDER_ROLES[index].USER_ID)
        }
        
    }
    return birthdays;
},

age : function (year, month, day) {
    var ages = [];
    for (let index = 0; index < setup.GENDER_ROLES.length; index++) {
        //console.log(user.id);
        //console.log(setup.GENDER_ROLES[index].USER_ID);
        if (setup.GENDER_ROLES[index].BIRTHDAY.MONTH == month && setup.GENDER_ROLES[index].BIRTHDAY.DAY == day) {
            ages.push(year - setup.GENDER_ROLES[index].BIRTHDAY.YEAR);
        }
        
    }
    return ages;
},

birthday : function (year, month, day) {
    const BDraw = setup.BIRTHDAY_MESSAGE;
    console.log(birthdate(year, month, day));
    let BDlength = birthdate(year, month, day).length;
    for (let indexBD = 0; indexBD < BDlength; indexBD++) {
        let BDdm = BDraw.replace(setup.USER_NAME, `${bot.users.cache.get(birthdate(year, month, day)[indexBD])}`).replace(setup.AGE, `${age(year, month, day)[indexBD]}`);
        let DMuser = bot.users.cache.get(birthdate(year, month, day)[indexBD]);
        DMuser.send(BDdm);
    }
},

isInThisClass : function (member) {
    for (let index2 = 0; index2 < setup.GENDER_ROLES.length; index2++) {
        if (setup.GENDER_ROLES[index2].USER_ID == member.user.id) {
            return true;
        }
        
    }
},

ifReacted : function (emojiID, msgID, msg) {
        msg.channel.messages.fetch({around: msgID, limit: 1})
        .then(message => {  
        let reactionVar = message.reactions.cache
        .find(r => r.emoji.name == emojiID);
        if (reactionVar) {
        return reactionVar
        .users.cache.array()
        .filter((u) => !u.bot)
    }});
},

sleep : function (milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
}