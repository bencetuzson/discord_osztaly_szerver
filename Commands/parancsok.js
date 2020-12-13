const Discord = require('discord.js');

module.exports = {
    name: 'parancsok',
    description: 'writes out the commands',
    execute(message, args, users){
        const Embed = new Discord.MessageEmbed()
            .setTitle('A parancsok, amiket tudsz használni')
            .setDescription("`[]` = általad meghatározott érték. Ezt a paraméterek megadásakor NE írd be!")
            .addFields(
                {name: "**`gyh!random`**", value: "A gép kisorsol egy személyt az osztályból."},
                {name: "**`gyh!csapat [csapatok száma]`**", value: "A gép csapatokat sorsol az osztály tagjaival annyi felé, amennyit a `[csapatok száma]` helyére írsz be.\nPéldául: `gyh!csapat 4`"},
                {name: "**`gyh!csapat tesi [f vagy l] [csapatok száma]`**", value: "A gép csapatokat sorsol arra a tesire, amelyik nem kezdőbetűjét írod a `[f vagy l]` helyére, és annyit , amennyit a `[csapatok száma]` helyére írsz be.\nPéldául: `gyh!csapat tesi f 2`"},
                {name: "**`gyh!orarend`**", value: "Kiírja az aktuális órarendet."},
                {name: "**`gyh!szulinap [név vagy tag]`**", value: "Elküldi privát üzenetben a `[név vagy tag]` helyére beírt személy születésnapját.\nPéldául: `gyh!szulinap Tuzsi` vagy `gyh!szulinap @" + message.guild.members.cache.get(idByNickname("Tuzsi")).nickname + "`"},
                {name: "**`gyh!szulinap [abc vagy datum]`**", value: "Elküldi privát üzenetben mindenki születésnapját az `[abc vagy datum]` helyére beírt rendezés szerint.\nPéldául: `gyh!szulinap datum`"},
                {name: "**`gyh!jon`**", value: "Kiírja a következő óra nevét, indőpontját és a tulajdonságait. Ha több óra is van párhuzamosan, akkor az aláhúzott lesz a te órád."},
                {name: "**`gyh!szin [HEX]`**", value: "Olyan színűre változtatja a neved, amit a `[HEX]` helyére írsz be. A HEX kód egy hat jegyú kód, amiknek a jegyei hexadecimális számokból állnak (1-10, A-F). Előtte általában egy *#* vagy *HEX* felirat áll. Fontos, hogy itt a HEX kód hat jegyű legyen, és ne legyen `000000` és `99aab5`! A kód *#* előtaggal és anélkül is műkodik.\nHa nem tudsz színkódot, ezek segíthetnek: [Google](https://www.google.com/search?ei=0RXAX7ibDo2vrgTZzZugDw&q=hex+color&oq=hex+color&gs_lcp=CgZwc3ktYWIQAzICCAAyBAgAEEMyAggAMgIIADICCAAyAggAMgIIADICCAAyAggAMgIIADoECAAQR1CoIFigImCRJWgAcAN4AIABdogBlwKSAQMyLjGYAQCgAQGqAQdnd3Mtd2l6yAEIwAEB&sclient=psy-ab&ved=0ahUKEwj4x5_ni6HtAhWNl4sKHdnmBvQQ4dUDCA0&uact=5), [név alapján](https://www.color-hex.com/color-names.html), [színválasztó](https://htmlcolorcodes.com/), [képről](https://imagecolorpicker.com/)\nPéldául: `gyh!szin abc123`"},
                {name: "**`gyh!szin [R] [G] [B]`**", value: "Olyan színűre változtatja a neved, amit az `[R] [G] [B]` helyére írsz be. Az RGB kód egy 3 elemű kód, amelynek elemei 0-255 közötti számokból állnak. Az első (R)  a pirosat, a második (G) a zöldet, és a harmadik (B) a kéket reprezentálja. Figyelj, hogy a paraméterek szóközzel legyenek elválasztva, és ne legyen közöttük vessző (*,*)!\nPéldául: `gyh!szin 123 45 6`"},
                {name: "**`gyh!szin [szín neve]`**", value: "Olyan színűre változtatja a neved, amit a `[szín neve]` helyére írsz be. A színek nevét a `gyh!szinek` paranccsal tudod előhívni. Ha a `random`-ot írod be paraméternek, akkor egy véletlenszerű színt kapsz.\nPéldául: `gyh!szin red`"},
                {name: "**`gyh!szin test [HEX]`**", value: "Megmutatja, hogy hogyan nézne ki az a HEX kóddal beírt szín, amit a `[HEX]` helyére írsz be. A színt a bal oldali csík színe fogja mutatni.\nPéldául: `gyh!szin test abc123`"},
                {name: "**`gyh!szin test [R] [G] [B]`**", value: "Megmutatja, hogy hogyan nézne ki az az RGB-vel beírt szín, amit az `[R] [G] [B]` helyére írsz be. A színt a bal oldali csík színe fogja mutatni.\nPéldául: `gyh!szin test 123 45 6`"},
                {name: "**`gyh!szin test [szín neve]`**", value: "Megmutatja, hogy hogyan nézne ki az a szín, amit a `[szín neve]` helyére írsz be. A színt a bal oldali csík színe fogja mutatni.\nPéldául: `gyh!szin test red`"},
                {name: "**`gyh!szinek`**", value: "Kiírja azokat a színeket, amiket a `gyh!szin [szín neve]` parancshoz tudsz használni."},
                {name: "**`gyh!dq`**", value: "Diákkvartett. Kisorsol egy asztalt és egy betűt."},
                {name: "**`gyh!nev [bn, kn vagy vn]`**", value: "Kiírja az osztálynévsort aszerint rendezve, amit a `[bn, kn vagy vn]` helyére írsz be. A `bn` a becenevet, a `kn` a keresztnevet, és a `vn` a vezetéknevet reprezentálja.\nPéldául: `gyh!nev vn`"},
                {name: "__**Még nincsenek kész:**__", value: "(Nyugodtan mondjatok még parancsokat!)"},
                {name: "**`gyh!laptop`**", value: "Kiírja, hogy mikor lesz legközelebb info, ezzel együtt, hogy kell-e akkor laptop."},
                {name: "**`gyh!series`**", value: "Kiírja a *Grand Yellow High School* sorozat legújabb részének adatait."},

            )
            .setColor('RANDOM')
            .setTimestamp();
        message.channel.send(Embed);

        function idByNickname(name) {
            for (const raw of users.USERS) {
                if (name === raw.NICKNAME) {
                    return raw.USER_ID;
                }
            }
        }
    }
}