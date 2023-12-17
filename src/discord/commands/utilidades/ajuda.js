const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require("discord.js");
const { FormatEmoji } = require("../../../functions");

const SelectMenuOptions = (label, desc, value, emoji) => {
    const option = new StringSelectMenuOptionBuilder()
    .setLabel(label)
    .setDescription(desc)
    .setValue(value);
    if (emoji) option.setEmoji(FormatEmoji(emoji));
    return option
}

module["exports"] = {
    name: 'help',
    aliases: ["ajuda"],
    infos: {
        description: "Obtenha uma lista com os comandos da Satsuki",
        category: "utilidades",
        usage: "help"
    },
    runner: async (client, message, params, prefix) => {
        const embedHelp = new EmbedBuilder()
            .setDescription(FormatEmoji(`
                ### Lista de comandos
                > - {e:exclamação} Olá, **${message.author.username}**, você pode **navegar** entre os meus **comandos** usando o **menu abaixo**. Ah, e caso tenha alguma **dúvida** de como utilizar algum **comando**, você pode usar o comando \`${prefix}comando <comando>\`
            `))
            .addFields([
                {
                    name: FormatEmoji('{link} Meus links'),
                    value: '[Servidor de Suporte](https://www.google.com) \n [Me convide](https://www.google.com)',
                    inline: true
                }, {
                    name: FormatEmoji('{interrogação} Como usar'),
                    value: '`<>` Obrigatório \n `[]` Opcional',
                    inline: true
                }
            ])
            .setThumbnail('https://i.imgur.com/eLPEX8F.png')
            .setTimestamp()
            .setFooter({ text: `Executado por: ${message.author.username}` })
            .setColor('327ba8');

            const Help = SelectMenuOptions('Início', 'Selecione está opção para voltar para o inicio.', 'início', '{inicio}');
            const HelpUtils = SelectMenuOptions('Utilidades', 'Selecione esta opção para ir a categoria de utilidades', 'utilidades', '{utilidades}');
            const HelpModeration = SelectMenuOptions('Moderação', 'Selecione esta opção para ir a categoria de moderação', 'moderação', '{moderação}');
            const HelpFunny = SelectMenuOptions('Diversão', 'Selecione esta opção para ir a categoria de diversão', 'diversão', '{diversão}');
            const HelpEconomy = SelectMenuOptions('Economia', 'Selecione esta opção para ir a categoria de economia', 'economia', '{economia}')

            const menu = new StringSelectMenuBuilder()
            .setPlaceholder('Selecione uma categoria')
            .setCustomId(`[menu_Help, ${message.author.id}]`)
            .setMaxValues(1)
            .setMinValues(0)
            .addOptions(Help, HelpUtils, HelpModeration, HelpFunny, HelpEconomy);

            const row = new ActionRowBuilder().addComponents(menu)

        message.channel.send({
            embeds: [embedHelp],
            components: [row]
        });
    }
};
