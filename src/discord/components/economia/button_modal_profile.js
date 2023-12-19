const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { createProfile, FormatEmoji } = require('../../../functions');
const { userDB } = require('../../../mongoDB');

module["exports"] = [{
    id: 'button_profile',
    authorOnly: true,
    runner: async (client, interaction, params) => {
        const modal = new ModalBuilder()
        .setCustomId(`[modal_profile, ${interaction.user.id}]`)
        .setTitle('Alterar sobre-mim');

        const modalInput = new TextInputBuilder()
        .setCustomId(`aboutmeInput`)
        .setLabel('Novo sobre-mim')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(112)
        .setRequired(true)
        .setPlaceholder('Digite aqui o seu novo sobre-mim.');

        const modalRow = new ActionRowBuilder().addComponents(modalInput);
        modal.addComponents(modalRow);
        await interaction.showModal(modal);

    }
}, {
    id: 'modal_profile',
    authorOnly: true,
    runner: async (client, interaction, params) => {
        const Input = interaction.fields.getTextInputValue('aboutmeInput');
        const doc = await userDB.findOne({ _id: params[0] });
        const Regex = /<(a?):[a-zA-Z0-9]+:[0-9]+>/g;

        if (Input == doc.profile.aboutme) {
            return interaction.reply({
                content: `**${interaction.user.username}**, o sobre-mim fornecido é o mesmo que o seu atualmente.`,
                ephemeral: true
            });
        } else if (Regex.test(Input)) {
            return interaction.reply({
                content: `**${interaction.user.username}**, forneça um sobre-mim que não possua **emojis** do discord.`,
                ephemeral: true
            });
        }

        await userDB.findOneAndUpdate({ _id: params[0] }, { $set: { "profile.aboutme": Input }})
        .then(async () => {
            await createProfile(interaction, params, client)
            .then(async (buffer) => {
                const files = [{ attachment: buffer, name: 'Profile.png' }]

                await interaction.update({
                    files
                })
                .then(() => {
                    interaction.followUp({
                        content: `**${interaction.user.username}**, o seu sobre-mim foi alterado com sucesso.`,
                        ephemeral: true
                    })
                })
            })
        })
    }
}]