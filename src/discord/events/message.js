const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')

const MESSAGE = require('../../constants/messages.json');
const { Perms } = require('../../constants/permissions.json');

const { FormatEmoji } = require('../../functions');
const { GuildPrefix } = require('../../mongoDB/functions/guild');
const { userDB } = require('../../mongoDB');

module["exports"] = {
    type: 'messageCreate',
    runner: async (client, message) => {
        if(message.author.bot) return;

        const prefix = "$" //await GuildPrefix(message.guild.id);

        if(message.content.replace('!', '').startsWith(`<@${client.user?.id}>`))
        return message.channel.send(FormatEmoji(`> - {e:chat} **Prazer, ${message.author.username}**! eu sou a **Satsuki**, uma incrivel bot **multifuncional** para o seu servidor. use o comando [ **${prefix}ajuda** ] para ver os meus comandos.`));

        if(!message.content.startsWith(prefix) || !message.guild) return;

        const params = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmdName = params.shift().toLowerCase();
        const command = client.commands.get(cmdName) || client.commands.find(als => als.aliases?.includes(cmdName));

        if (!command) return;
        if (command.devops && !client.developers.includes(message.author.id)) return;

        //if (!client.developers.includes(message.author.id)) return message.channel.send('**EM DESENVOLVIMENTO**')

        const mentions = message.mentions.users;
        const userCache = client.users.cache;
        const mentioned = userCache.get(params[0]) || userCache.find(user => user.username === params[0]) || mentions.first();

        const _userDB = await userDB.findById(message.author.id);
        const mentionedDB = await userDB.findById(mentioned?.id);
        const mentionArgs = !!mentions.size ? true : !!mentioned?.id ? true : false;

        const messageDB = !_userDB ? MESSAGE.DATABASE.AUTHOR : MESSAGE.DATABASE.MENTIONED;
        
        if (!_userDB && command.name !== "verificar" || !mentionedDB && mentionArgs)
        return message.channel.send(FormatEmoji(messageDB.replace(/<name>|<command>/g, (matched) => { return matched === "<name>" ? message.author.username : `${prefix}verificar` })));

        const messageBl = _userDB?.blacklist["isBlacklisted"] ? MESSAGE.BLACKLISTED.AUTHOR : MESSAGE.BLACKLISTED.MENTIONED;

        const buttonSupport = new ButtonBuilder().setLabel('Servidor de suporte').setStyle(ButtonStyle.Link).setURL('https://www.google.com');
        const rowSupport = new ActionRowBuilder().addComponents(buttonSupport);

        if (_userDB?.blacklist["isBlacklisted"] && command.name !== "suporte" || mentionedDB?.blacklist["isBlacklisted"] && mentionArgs)
        return message.channel.send({ content: FormatEmoji(messageBl.replace(/<name>|<command>/g, (matched) => { return matched === "<name>" ? message.author.username : `${prefix}suporte` })), components: [rowSupport]});

        const TranslatePerms = (input) => {
            return input.map(permission => `**\` ${Perms[permission]} \`**` || input).join(', ');
        };

        if (command.AuthorPerms && !message.member.permissions.has(command.AuthorPerms || []))
        return message.channel.send(FormatEmoji(MESSAGE.PERMISSIONS.AUTHOR.replace(/<name>|<permissions>/g, (matched) => { return matched === "<name>" ? message.author.username : TranslatePerms(command.AuthorPerms) })));

        if (command.SatsukiPerms && !message.guild.members.cache.get(client.user.id).permissions.has(command.SatsukiPerms || []))
        return message.channel.send(FormatEmoji(MESSAGE.PERMISSIONS.CLIENT.replace(/<name>|<permissions>/g, (matched) => { return matched === "<name>" ? message.author.username : TranslatePerms(command.SatsukiPerms) })));

        const miliseconds = client.cooldowns.get(`${message.author.id}-${command.name}`) / 1000;

        if (command.category !== "desenvolvedor" && client.cooldowns.has(`${message.author.id}-${command.name}`))
        return message.channel.send(FormatEmoji(MESSAGE.COOLDOWNS.replace(/<name>|<cooldown>/g, (matched) => { return matched === "<name>" ? message.author.username : Math.trunc(miliseconds) })));

        client.cooldowns.set(`${message.author.id}-${command.name}`, Date.now() + 7000);
        setTimeout(() => { client.cooldowns.delete(`${message.author.id}-${command.name}`) }, 7000);

        try {
            command.runner(client, message, params, prefix);
        } catch (error) {
            console.error('Erro ao executar o comando:', error);
        }            
    }
}