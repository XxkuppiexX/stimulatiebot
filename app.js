const Discord = require("discord.js");

const client = new Discord.Client();

const config = require("./config.json");



client.on('guildMemberAdd', member => {
    member.guild.channels.get('444882109086171146').send('Hey ' + member + '! Welkom in RealityMC! Veel plezier!'); 
});

function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

var prefix = "!";

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

if (message.content.toLowerCase().startsWith(prefix + `open ticket`)) {
    const reason = message.content.split(" ").slice(1).join(" ");
    if (message.guild.channels.exists("name", "ticket-" + message.author.username)) return message.channel.send(`Jij hebt op dit moment al een ticket open.`);
    message.guild.createChannel(`ticket-${message.author.username}`, "text").then(c => {
        let role = message.guild.roles.find("name", "Supporter", "🔰 Sr Moderator", "🔰 Moderator", "🔰 Jr Moderator", "🔰 Discord Moderator", "💼 Administrator", "🔧 Bot Developer", "👑 Beheer");
        let role2 = message.guild.roles.find("name", "@everyone");
        c.overwritePermissions(role, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        c.overwritePermissions(role2, {
            SEND_MESSAGES: false,
            READ_MESSAGES: false
        });
        c.overwritePermissions(message.author, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        message.channel.send(`:white_check_mark: Je ticket is gemaakt, #${c.name}.`);
        const embed = new Discord.RichEmbed()
        .setColor(0xCF40FA)
        .addField(`Je ticket is succesvol gemaakt ${message.author.username}!`, `Leg in de ticket zo goed mogelijk uit waarom jij deze hebt geopend.\nEen stafflid zou jou zo snel mogelijk helpen met jouw vraag.\nDe maximale wachttijd voor het antwoord op jouw ticket is 1 uur.`)
        .setTimestamp();
        c.send({ embed: embed });
    }).catch(console.error);
}
if (message.content.toLowerCase().startsWith(prefix + `sluit`)) {
    if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`je kan het ticket niet sluiten als je niet in de channel van de ticket zit.`);

    message.channel.send(`Weet je het zeker? Deze actie kan niet ongedaan worden gemaakt\nAls je het zeker weet typ \`!ikweethetzeker\`. Na 10 seconde word dit geanuleerd en zal dit ticket niet verwijderd worden.`)
    .then((m) => {
      message.channel.awaitMessages(response => response.content === '!ikweethetzeker', {
        max: 1,
        time: 10000,
        errors: ['time'],
      })
      .then((collected) => {
          message.channel.delete();
        })
        .catch(() => {
          m.edit('Je hebt geen !ikweethetzeker getypt, het ticket word niet gesloten').then(m2 => {
              m2.delete();
          }, 3000);
        });
    });
}

});

client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.

  if(command === "storing") {
    if(!message.member.roles.some(r=>["🔧 Bot Developer", "👑 Beheer"].includes(r.name)) )
      return message.reply("Sorry je hebt hier geen perms voor :(");
    let naam = args[0];
      let storing = args.slice(1).join(" ");
    message.channel.send({embed: {
      color: 0xff0000,
      title: "**Storing Dienst**",
      description:"**Storing Type:**\n" + naam + "\n \n**Bescrijving:**\n" + storing,
      footer: {
        text: "© RealityMC"
    }
  }
  });
  }

  if(command === "say") {
    if(!message.member.roles.some(r=>["👑 Beheer", "💼 Administrator", "🔰 Sr Moderator", "🔰 Moderator", "🔰 Jr Moderator", "🔰 Discord Moderator", "🔧 Bot Developer"].includes(r.name)) )
    return message.reply("Sorry je hebt hier geen perms voor :(");
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing:
    message.channel.send(sayMessage);
  }


if(command === "set") {
  if(!message.member.roles.some(r=>["👑 Beheer", "🔧 Bot Developer"].includes(r.name)) )
  return message.reply("Je hebt hier geen perms voor");
  const sayMessage = args.join(" ");
  message.delete().catch(O_o=>{});
  client.user.setActivity(sayMessage);
}
	
	
  if(command === "warn") {
    if(!message.member.roles.some(r=>["👑 Beheer", "💼 Administrator", "🔰 Sr Moderator", "🔰 Moderator", "🔰 Jr Moderator", "🔰 Discord Moderator", "🔧 Bot Developer"].includes(r.name)) )
    return message.reply("Sorry je hebt hier geen perms voor vraag staff om hulp.");
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send("Dit is een waarschuwing wegens:" + sayMessage);
  }

  
  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["👑 Beheer", "💼 Administrator", "🔰 Sr Moderator", "🔰 Moderator", "🔰 Jr Moderator", "🔰 Discord Moderator", "🔧 Bot Developer"].includes(r.name)) )
      return message.reply("je kan geen !kick vraag staff om hulp");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("je moet @ gebruiken");
    if(!member.kickable) 
      return message.reply("hu, ik kan hem niet kicken heb ik eigenlijk wel kick perms??");
    
    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "hij heeft geen reden ingevult";
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} kan ik niet kicken om: ${error}`));
    message.reply(`${member.user.tag} is gekickt door ${message.author.tag} omdat: ${reason}`);

  }
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["👑 Beheer", "💼 Administrator", "🔰 Sr Moderator", "🔰 Moderator", "🔰 Jr Moderator", "🔰 Discord Moderator", "🔧 Bot Developer"].includes(r.name)) )
      return message.reply("sorry je kan geen !ban vraag staff om hulp");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("je moet @ gebruiken");
    if(!member.bannable) 
      return message.reply("hu, ik kan hem niet bannen heb ik eigenlijk wel ban perms??");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "geen reden ingevult";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} kan ik niet bannen om: ${error}`));
    message.reply(`${member.user.tag} is geband door ${message.author.tag} omdat: ${reason}`);
  }
  
  if(command === "clear") {
    if(!message.member.roles.some(r=>["👑 Beheer", "💼 Administrator", "🔧 Bot Developer"].includes(r.name)) )
    return message.reply("je kan geen !clear vraag staff om hulp");
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("voer een nummer tussen de 2 en 100 in");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`ik kan de message's niet delete omdat: ${error}`));
  }
});

client.on('message', message => {
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  if (!message.guild) return;

  if (message.content === '!join') {
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => { // Connection is an instance of VoiceConnection
          message.reply('Ik ben geconnect in de channel!');
        })
        .catch(console.log);
    } else {
      message.reply('je moet eerst verbinden met een kanaal!');
    }
  }
});

client.login(process.env.BOT_TOKEN);
