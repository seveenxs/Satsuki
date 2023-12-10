const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ActionRow } = require('discord.js');
const { IncrementCrystals, DecrementPresent, getUser } = require('../../../mongoDB/functions/user');
const { presents } = require('../../../constants/presents.json');
const { FormatEmoji } = require('../../../functions');

module["exports"] = [{
    id: "presentsOpen",
    runner: async (client, interaction, params) => {
        if (interaction.user.id !== params[0]) return interaction.deferUpdate();
        const presentsValue = interaction.values[0];
        if (presentsValue === "noting") {
            interaction.deferUpdate();
            return;
        }

        await DecrementPresent(interaction.user.id, presentsValue, 1)
        const userData = await getUser(interaction.user.id, ["presents", "premium"]);

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
        .setDescription(`${interaction.user.username} você não possui presentes`)
        .setValue('nothing');

        const menuOptions = presentes.map((presents) => new StringSelectMenuOptionBuilder()
        .setLabel(presents.label)
        .setDescription(presents.description)
        .setEmoji(presents.emoji)
        .setValue(presents.value));

        const menu = new StringSelectMenuBuilder()
        .setPlaceholder('Selecione o presente que deseja abrir')
        .setCustomId(`[presentsOpen, ${interaction.user.id}]`)
        .setMaxValues(1)
        .setMinValues(0)
        .addOptions(presentes.length <= 0 ? menuNothing : menuOptions);

        const row = new ActionRowBuilder().addComponents(menu);

        const embed = new EmbedBuilder()
            .setTitle('Abrindo presente')
            .setDescription(FormatEmoji(`> - {e:exclamação} **\` ${interaction.user.username} \`**, você abriu com **sucesso** um **${presents[presentsValue]?.name}**, vejá logo abaixo todas **recompensas** que você **recebeu**.`))
            .setThumbnail('https://i.imgur.com/TGbjf0F.png')
                .setTimestamp()
                .setFooter({
                    text: `Executado por: ${interaction.user.username}`
                })
                .setColor('#327ba8');

        await interaction.update({ components: [row] }).then(async () => {
            const isPremium = userData?.premium ? 2 : 1
            const presentesData = presents[presentsValue]
            const randomCristais = Math.max(presentesData?.drops?.cristais[0] || 1000, Math.floor(Math.random() * presentesData?.drops?.cristais[1]) * isPremium);

            if (presentsValue == "prismatic") {
                embed.addFields([
                    {
                        name: '**Lista de recompensas**',
                        value: FormatEmoji(`{cristais} ${randomCristais.toLocaleString()} cristais`)
                    }
                ]);

                await interaction.followUp({ embeds: [embed], ephemeral: true })
                .then(async () => { await IncrementCrystals(interaction.user.id, randomCristais) });
            }
        });
    }
}]