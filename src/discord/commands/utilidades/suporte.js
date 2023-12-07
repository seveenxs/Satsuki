const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const { FormatEmoji } = require('../../../functions');

module.exports = {
    name: 'suporte',
    infos: {
        description: "Obtenha informações sobre o suporte.",
        category: "utilidades",
        usage: "suporte"
    },
    runner: async (client, message, params) => {

        const suporte = new ButtonBuilder()
        .setLabel('Suporte')
        .setStyle(ButtonStyle.Link)
        .setURL('https://www.google.com');

        const row = new ActionRowBuilder().addComponents(suporte)


        message.channel.send({
            content: FormatEmoji(`> - {e:exclamação} **\` ${message.author.username} \`**, você poderar ir no meu **servidor de suporte**, clicando no botão abaixo, ficarei feliz em vê-lo lá.`),
            components: [row]
        })
    }
};
