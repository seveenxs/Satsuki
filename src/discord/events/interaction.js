const { userDB } = require("../../mongoDB");
const MESSAGE = require('../../constants/messages.json');
const { FormatEmoji } = require("../../functions");

module["exports"] = {
    name: 'interactionCreate',
    runner: async (client, interaction) => {
        const _userDB = await userDB.findById(interaction.user.id);

        if (_userDB?.blacklist["isBlacklisted"])
        return interaction.reply({ content: FormatEmoji(MESSAGE.BLACKLISTED.AUTHOR.replace(/<name>|<command>/g, (matched) => { return matched === "<name>" ? interaction.user.username : `${client.prefix}suporte` })), ephemeral: true });

        if (interaction.message.createdTimestamp < (client.readyTimestamp || 0))
        return interaction.reply({ content: FormatEmoji(`> - {e:exclamação} Não há nada aqui, parece que os dados dessa interação foram perdidos.`), ephemeral: true });


    }
}