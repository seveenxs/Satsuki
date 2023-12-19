const { createProfile, FormatEmoji } = require('../../../functions');
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module["exports"] = {
    name: 'perfil',
    aliases: ["profile", "p"],
    infos: {
        description: "Veja o perfil do usuário especificado ou o seu.",
        category: "economia",
        usage: "perfil [usuário]"
    },
    runner: async (client, message, params, prefix) => {
        const mentions = message.mentions.users
        const userCache = client.users.cache;
        const userFinal = userCache.get(params[0]) || userCache.find(user => user.username === params[0]) || mentions.first() || message.author;

        const AboutmeButton = new ButtonBuilder()
        .setLabel('Alterar — sobre-mim')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('<:chat:1179774228753567794>')
        .setCustomId(`[button_profile, ${message.author.id}]`)
        .setDisabled(message.author.id == userFinal.id ? false : true);

        const row = new ActionRowBuilder().addComponents(AboutmeButton);

        const msg = await message.channel.send(FormatEmoji(`**${message.author.username}**, aguarde enquanto ${message.author.id === userFinal.id ? 'seu perfil' : `o perfil de **${userFinal.username}**`} está sendo gerado...`));

        createProfile(message, params, client)
        .then(buffer => {
            const files = [{ attachment: buffer, name: 'Profile.png' }]

            msg.edit({ content: '', files, components: [row] });
        })
        .catch(err => {
            msg.edit({ content: FormatEmoji(`> - {e:remove} Ocorreu um erro enquanto gerávamos o perfil do usuário. Por favor, tente novamente mais tarde.`)})
            console.log(err)
        }); 
    }
}