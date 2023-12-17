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

module["exports"] = [{
    id: 'menu_Help',
    authorOnly: true,
    runner: async (client, interaction, _, prefix) => {
        const HelpValues = interaction.values[0];

        const FilterCommands = (category) => {
            const ctg = client.commands.filter(commands => commands.infos?.category === category?.toLowerCase());
            const commandsMapped = ctg.map(cmd => `${prefix}${cmd.name}`);
            return commandsMapped;
        };

        if (FilterCommands(HelpValues).length === 0 && HelpValues !== 'início') {
            await interaction.deferUpdate()
            await interaction.followUp({
                content: `a categoria ${HelpValues} está em desenvolvimento...`,
                ephemeral: true
            });
            return
        }

        const Help = SelectMenuOptions('Início', 'Selecione está opção para voltar para o inicio.', 'início', '{inicio}');
        const HelpUtils = SelectMenuOptions('Utilidades', 'Selecione esta opção para ir a categoria de utilidades', 'utilidades', '{utilidades}');
        const HelpModeration = SelectMenuOptions('Moderação', 'Selecione esta opção para ir a categoria de moderação', 'moderação', '{moderação}');
        const HelpFunny = SelectMenuOptions('Diversão', 'Selecione esta opção para ir a categoria de diversão', 'diversão', '{diversão}');
        const HelpEconomy = SelectMenuOptions('Economia', 'Selecione esta opção para ir a categoria de economia', 'economia', '{economia}')

        const menu = new StringSelectMenuBuilder()
        .setPlaceholder('Selecione uma categoria')
        .setCustomId(`[menu_Help, ${interaction.user.id}]`)
        .setMaxValues(1)
        .setMinValues(0)
        .addOptions(Help, HelpUtils, HelpModeration, HelpFunny, HelpEconomy);

        const row = new ActionRowBuilder().addComponents(menu);

        const embedHelp = new EmbedBuilder()
            .setThumbnail('https://i.imgur.com/eLPEX8F.png')
            .setTimestamp()
            .setFooter({ text: `Executado por: ${interaction.user.username}` })
            .setColor('327ba8');
        
        if (HelpValues === 'início') {
            embedHelp.setDescription(FormatEmoji(`
            ### Lista de comandos
            > - {e:exclamação} Olá, **${interaction.user.username}**, você pode **navegar** entre os meus **comandos** usando o **menu abaixo**. Ah, e caso tenha alguma **dúvida** de como utilizar algum **comando**, você pode usar o comando \`${prefix}comando <comando>\`
        `))
            embedHelp.addFields([
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
        } else {
            embedHelp.setDescription(FormatEmoji(`
            ### Lista de comandos — ${HelpValues}
            \`\`\` ${FilterCommands(HelpValues).join(", ")} \`\`\`
            `))
        }

        await interaction.update({
            embeds: [embedHelp],
            components: [row]
        })
    }
}]