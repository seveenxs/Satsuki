const { EmbedBuilder } = require('discord.js')
const { getUser } = require('../../../mongoDB/functions/user');

module["exports"] = [{
    id: "infoFishing",
    runner: async (client, interaction, params) => {
        if (interaction.user.id !== params[0]) return interaction.deferUpdate();
        const FishingValues = interaction.values[0];

        const userData = await getUser(interaction.user.id, ["fishingrod"]);

        if (FishingValues === "infoFishingRod") {
            const embed = new EmbedBuilder()
            .setTitle('🎣 Informações — vara de pesca')
            .setDescription(`> - **› Proficiência: \` ${userData.proficiency} \`**
            > - **› Experiência: \` ${userData.expMin} / ${userData.expMax} \`**
            > - **› Durabilidade: \` ${userData.durability}% \`**`)
            .setThumbnail('https://i.imgur.com/2blm4XU.png')
            .setTimestamp()
            .setFooter({
                text: `Executado por: ${interaction.user.username}`
            })
            .setColor('#327ba8');

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        }
    }
}]