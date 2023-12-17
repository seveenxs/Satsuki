const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { getUser, IncrementCrystals } = require('../../../mongoDB/functions/user');
const { FormatEmoji } = require("../../../functions");

module["exports"] = [{
    id: 'button_daily',
    authorOnly: true,
    runner: async (client, interaction, params) => {
        let Multiplies = [];
        
        for (let m = 0; m < 5; m++) {
            let Multiply = (Math.random() + 1).toFixed(1);
            Multiply = (Multiply === '1.0') ? 1.1 : Multiply;
            Multiplies.push(Multiply);
        }

        const buttons = Array.from({ length: 5 }, (_, i) => {
            return new ButtonBuilder()
            .setLabel(`${Multiplies[i]}x`)
            .setStyle(params[1] == i ? ButtonStyle.Success : ButtonStyle.Secondary)
            .setCustomId(`[button_daily, ${interaction.user.id}, ${i}]`)
            .setDisabled(true);
        });
        const buttonsRow = new ActionRowBuilder().addComponents(...buttons);

        const EmbedDaily = new EmbedBuilder()
        .setDescription(FormatEmoji(`
        ### Recompensa diária
        > - {e:exclamação} Olá, **${interaction.user.username}**, você ganhou **({cristais}) ${params[2].toLocaleString()}** cristais em sua recompensa diária. Escolha um dos 5 botões abaixo para **multiplicar** os seus cristais.
        `))
        .setFields({
            name: 'Cristais ganhos',
            value: `\`\`\` + ${Math.round(params[2] * (Multiplies[params[1]] - 1))} cristais\`\`\``
        })
        .setTimestamp()
        .setThumbnail('https://i.imgur.com/RRzRCGy.png')
        .setFooter({ text: `Executado por: ${interaction.user.username}`, })
        .setColor('327ba8');

        interaction.update({
            components: [buttonsRow],
            embeds: [EmbedDaily]
        }).then(async () => {
            await IncrementCrystals(interaction.user.id, parseInt(Math.round(params[2] * (Multiplies[params[1]] - 1))) + parseInt(params[2]))
        })
    }
}]