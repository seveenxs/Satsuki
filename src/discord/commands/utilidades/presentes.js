const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ActionRow } = require('discord.js');
const { presents } = require('../../../constants/presents.json');
const { getUser } = require('../../../mongoDB/functions/user');
const { FormatEmoji } = require('../../../functions');
const { userDB } = require('../../../mongoDB');

module.exports = {
    name: 'presentes',
    aliases: ["presente", "pr", "gift", "gifts", "gi"],
    infos: {
        description: "Abra ou veja os presentes que você possui",
        category: "utilidades",
        usage: "presentes"
    },
    runner: async (_, message, params) => {
        const userData = await userDB.findOne({ _id: message.author.id });

        const presentes = Object.entries(userData.presents).map(([presentes, quantity]) => {
            const PresentsData = presents[presentes];

            if (quantity >= 1) {
                return {
                    label: `${quantity}x ` + PresentsData.name,
                    description: `Selecione esta opção para abrir o ${PresentsData.name}`,
                    emoji: FormatEmoji(PresentsData.emoji),
                    value: presentes
                }
            } else {
                return null
            }
        }).filter(gift => gift !== null);

        const menuNothing = new StringSelectMenuOptionBuilder()
        .setLabel('Não possui presentes')
        .setDescription(`${message.author.username} você não possui presentes`)
        .setValue('nothing');

        const menuOptions = presentes.map((presents) => new StringSelectMenuOptionBuilder()
        .setLabel(presents.label)
        .setDescription(presents.description)
        .setEmoji(presents.emoji)
        .setValue(presents.value));

        const menu = new StringSelectMenuBuilder()
        .setPlaceholder('Selecione o presente que deseja abrir')
        .setCustomId(`[presentsOpen, ${message.author.id}]`)
        .setMaxValues(1)
        .setMinValues(0)
        .addOptions(presentes.length <= 0 ? menuNothing : menuOptions);

        const row = new ActionRowBuilder().addComponents(menu)

        let embed = new EmbedBuilder()
        .setTitle(`Presentes de ${message.author.username}`)
        .setDescription(FormatEmoji(`> - {e:exclamação} **\` ${message.author.username} \`**, para **você** ver ou abrir os seus **presentes**, interaja com o **menu** abaixo. algumas **dicas** de como conseguir **presentes**: **\` missões diárias \`** **\` eventos aleatórios \`**, entre outras formas!`))
        .setThumbnail('https://i.imgur.com/TGbjf0F.png')
        .setTimestamp()
        .setFooter({
            text: `Executado por: ${message.author.username}`
        })
        .setColor('#327ba8');

        message.channel.send({
            embeds: [embed],
            components: [row]
        })
    }
};
