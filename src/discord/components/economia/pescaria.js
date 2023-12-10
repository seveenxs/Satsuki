const { EmbedBuilder } = require('discord.js')
const { getUser } = require('../../../mongoDB/functions/user');
const { FormatEmoji } = require('../../../functions');

module["exports"] = [{
    id: "infoFishing",
    runner: async (client, interaction, params) => {
        if (interaction.user.id !== params[0]) return interaction.deferUpdate();
        const FishingValues = interaction.values[0];

        const userData = await getUser(interaction.user.id, ["fishingrod", "vhessels"]);

        if (FishingValues === "infoFishingRod") {
            const embed = new EmbedBuilder()
            .setTitle('🎣 Informações — vara de pesca')
            .setDescription(`> - **› Proficiência: \` ${userData["fishingrod"].proficiency} \`**
            > - **› Experiência: \` ${userData["fishingrod"].expMin} / ${userData["fishingrod"].expMax} \`**
            > - **› Durabilidade: \` ${userData["fishingrod"].durability}% \`**`)
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
        } else if (FishingValues === 'infoVhessels') {
            if (!userData["vhessels"].hasVhessels) {
                await interaction.reply({
                    content: FormatEmoji(`> - {e:error} Você não possui uma embarcação, você poderá comprar uma embarcação com um construtor usando [ **${client.prefix}contratar** ]`),
                    ephemeral: true
                })
            }
        }
    }
}]