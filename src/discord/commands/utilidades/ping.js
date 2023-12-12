const { EmbedBuilder } = require("discord.js")
const { FormatEmoji } = require("../../../functions")
const { LatencyDB } = require('../../../mongoDB/functions/database')

module["exports"] = {
    name: 'ping',
    infos: {
        description: "Obtenha informações sobre as latência de Satsuki",
        category: "utilidades",
        usage: "ping"
    },
    runner: async (client, message, params, prefix) => {
        
        message.channel.send({
            content: `> - **(🪐) ›** **${message.author.username}**, a minha **latência** e de **\` ${client.ws.ping}ms \`**, e estou acordada há: <t:${Math.trunc(client.readyTimestamp/1000)}:R>`
        })
    }
}