const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { getUser, setCooldown } = require('../../../mongoDB/functions/user');
const { FormatEmoji } = require("../../../functions");
const { abbreviate } = require('util-stunks');

module["exports"] = {
    name: 'daily',
    aliases: ["bolsafamilia", "bolsa-familia"],
    infos: {
        description: "Resgate a sua recompensa diária.",
        category: "economia",
        usage: "daily"
    },
    runner: async (client, message, params, prefix) => {

        const cooldowns = await getUser(message.author.id, ["cooldowns"]);
        const CoolDaily = cooldowns.get('daily');
        if (CoolDaily > Date.now())
        return message.channel.send(`> - **(⏰) ›** Calma aí, **${message.author.username}**! você já resgatou a sua **recompensa diária** em um período de **24 horas**; volte novamente em [ <t:${Math.round(CoolDaily / 1000)}:R> ]`)

        const Cristais = Math.floor(Math.random() * (1500 - 200)) + 200;

        const buttons = Array.from({ length: 5 }, (_, i) => {
            return new ButtonBuilder()
            .setLabel("-")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(`[button_daily, ${message.author.id}, ${i}, ${Cristais}]`);
        });
        const buttonsRow = new ActionRowBuilder().addComponents(...buttons);

        const EmbedDaily = new EmbedBuilder()
        .setDescription(FormatEmoji(`
        ### Recompensa diária
        > - {e:exclamação} Olá, **${message.author.username}**, você ganhou **({cristais}) ${Cristais.toLocaleString()}** cristais em sua recompensa diária. Escolha um dos 5 botões abaixo para **multiplicar** os seus cristais.
        `))
        .setTimestamp()
        .setThumbnail('https://i.imgur.com/RRzRCGy.png')
        .setFooter({ text: `Executado por: ${message.author.username}`, })
        .setColor('327ba8');

        message.channel.send({
            embeds: [EmbedDaily],
            components: [buttonsRow]
        }).then(async () => {
            await setCooldown(message.author.id, ['daily'], Date.now() + 86400000)
        })
    }
};