const { userDB } = require("../../mongoDB");
const MESSAGE = require('../../constants/messages.json');
const { FormatEmoji } = require("../../functions");
const { GuildPrefix } = require('../../mongoDB/functions/guild');

module["exports"] = {
    type: 'interactionCreate',
    runner: async (client, interaction) => {
        const _userDB = await userDB.findById(interaction.user.id);
        const prefix = await GuildPrefix(interaction.guild.id);

        if (_userDB?.blacklist["isBlacklisted"])
        return interaction.reply({ content: FormatEmoji(MESSAGE.BLACKLISTED.AUTHOR.replace(/<name>|<command>/g, (matched) => { return matched === "<name>" ? interaction.user.username : `${prefix}suporte` })), ephemeral: true });

        if (interaction.message.createdTimestamp < (client.readyTimestamp || 0)) {
            interaction.message.edit({ components: [] });
            return interaction.reply({ content: FormatEmoji(`> - {e:exclamação} Não há nada aqui, parece que os dados dessa interação foram perdidos.`), ephemeral: true });
        }

        if (interaction.isStringSelectMenu()) {
            const params = (interaction.customId.match(/\[([^\]]*)\]/) || [, ''])[1].split(',').map(param => param.trim());

            const selectmenu = params.length > 0 ? client.components.get(params[0]) : client.components.get(interaction.customId);

            if (selectmenu.authorOnly && interaction.user.id !== params[1])
            return interaction.deferUpdate();

            params.shift()
            if (selectmenu) selectmenu.runner(client, interaction, params, prefix);
        }


        if (interaction.isButton()) {
            const params = (interaction.customId.match(/\[([^\]]*)\]/) || [, ''])[1].split(',').map(param => param.trim());

            const Button = params.length > 0 ? client.components.get(params[0]) : client.components.get(interaction.customId);
            if (Button.authorOnly && interaction.user.id !== params[1])
            return interaction.deferUpdate();

            params.shift()
            if (Button) Button.runner(client, interaction, params);
        }

        if (interaction.isModalSubmit()) {
            const params = (interaction.customId.match(/\[([^\]]*)\]/) || [, ''])[1].split(',').map(param => param.trim());

            const Modal = params.length > 0 ? client.components.get(params[0]) : client.components.get(interaction.customId);
            if (Modal.authorOnly && interaction.user.id !== params[1])
            return interaction.deferUpdate();

            params.shift()
            if (Modal) Modal.runner(client, interaction, params);
        }
    }
}