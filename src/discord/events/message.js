const MESSAGE = require('../../constants/messages.json');
const { FormatEmoji } = require('../../functions');
const { userDB } = require('../../mongoDB');

module["exports"] = {
    type: 'messageCreate',
    runner: async (client, message) => {
        if(message.author.bot) return;

        if(message.content.replace('!', '').startsWith(`<@${client.user?.id}>`))
        return message.channel.send(FormatEmoji(`> - {e:exclamação} Prazer, **\` ${message.author.username} \`** eu me chamo **Satsuki** uma incrível bot **multifuncional**, use **\` ${client.prefix}ajuda \`** para ver os meus comandos. ate logo!`));

        if(!message.content.startsWith(client.prefix) || !message.guild) return;

        const params = message.content.slice(client.prefix.length).trim().split(/ +/g);
        const cmdName = params.shift().toLowerCase();
        const command = client.commands.get(cmdName) || client.commands.find(als => als.aliases?.includes(cmdName));

        if (!command) return;
        if (command.devops && client.developers.includes(message.author.id)) return;

        const mentions = message.mentions.users;
        const userCache = client.users.cache;
        const mentioned = userCache.get(params[0]) || userCache.find(user => user.username === params[0]) || mentions.first();

        const _userDB = await userDB.findById(message.author.id);
        const mentionedDB = await userDB.findById(mentioned?.id);
        const mentionArgs = !!mentions ? true : !!mentioned ? true : false;

        const messageDB = !_userDB ? MESSAGE.DATABASE.AUTHOR : MESSAGE.DATABASE.MENTIONED;

        if (!_userDB && command.name !== "verificar" || mentionedDB && mentionArgs)
        return message.channel.send(FormatEmoji(messageDB.replace(/<name>|<command>/g, (matched) => { return matched === "<name>" ? message.author.username : `${client.prefix}verificar` })));

    }
}