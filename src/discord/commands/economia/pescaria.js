const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ActionRow } = require('discord.js')
const { FormatEmoji } = require('../../../functions');

const menuOptions = (label, description, value, emoji) => {
    const menuString = new StringSelectMenuOptionBuilder()
    .setLabel(label)
    .setDescription(description)
    .setValue(value);
    if (emoji) menuString.setEmoji(FormatEmoji(emoji));
    return menuString;
};

module.exports = {
    name: 'pescaria',
    infos: {
        description: "Veja informações sobre a pescaria",
        category: "economia",
        usage: "pescaria"
    },
    runner: async (client, message, params) => {
        
        const embed = new EmbedBuilder()
        .setTitle('Pescaria da Satsuki')
        .setDescription(FormatEmoji(`> - {e:exclamação} **Bem-vindo(a), \` ${message.author.username} \`**, à **Pescaria da Satsuki**! Aqui, você pode acessar informações sobre sua **vara de pesca** ou **embarcações**, além de ter a opção de **vender** suas pescas na **Peixaria** da Satsuki.`))
        .setThumbnail('https://i.imgur.com/2blm4XU.png')
        .setTimestamp()
        .setFooter({
            text: `Executado por: ${message.author.username}`
        })
        .setColor('#327ba8');

        const infoFishingRod = menuOptions('Vara de pesca', 'Veja as informações da sua vara de pesca.', 'infoFishingRod', '🎣');
        const infoVhessels = menuOptions('Embarcações', 'Veja as informações da sua embarcação.', 'infoVhessels', '⛵');
        
        const shopFishing = menuOptions('Vender peixes', 'Venda as suas pesca para a Satsuki.', 'shopFishing', '💸');
        const Fishing = menuOptions('Ir pescar', 'Vá para o local de pesca.', 'Fishing', '{peixe}');

        const menu = new StringSelectMenuBuilder()
        .setPlaceholder('Informações')
        .setCustomId(`[infoFishing, ${message.author.id}]`)
        .setMaxValues(1)
        .setMinValues(0)
        .addOptions(infoFishingRod, infoVhessels);


        const menu1 = new StringSelectMenuBuilder()
        .setPlaceholder('Pescaria')
        .setCustomId(`[Fishing, ${message.author.id}]`)
        .setMaxValues(1)
        .setMinValues(0)
        .addOptions(shopFishing, Fishing);

        const row = new ActionRowBuilder().addComponents(menu)
        const row1 = new ActionRowBuilder().addComponents(menu1)

        message.channel.send({
            embeds: [embed],
            components: [row, row1]
        })
    }
};
