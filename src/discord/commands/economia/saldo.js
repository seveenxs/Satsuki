const { abbreviate } = require('util-stunks')
const { userDB } = require('../../../mongoDB');
const { getUser } = require('../../../mongoDB/functions/user');
const { FormatEmoji } = require("../../../functions");

module["exports"] = {
    name: 'cristais',
    aliases: ["atm", "bal", "saldo"],
    infos: {
        description: "Saiba a quantidade de cristais que você ou o usuário especificado possui.",
        category: "economia",
        usage: "saldo [Usuário]"
    },
    runner: async (client, message, params) => {
        const mentions = message.mentions.users;
        const userCache = client.users.cache;
        const finalUser = userCache.get(params[0]) || userCache.find(user => user.username === params[0]) || mentions.first() || message.author;

        const PositionCrystals = await userDB.find()
        const sortedUser = PositionCrystals.sort((pc, pf) => pf.crystals - pc.crystals);
        const IndexPosition = sortedUser.findIndex(user => user.id === finalUser?.id) + 1;
        const getCrystals = await getUser(finalUser.id, ["crystals"]);

        message.reply({
            content: FormatEmoji(`> - {e:cristais} **${message.author.username}**, ${finalUser?.id === message.author.id ? 'você' : `**${finalUser?.username}**`} possui um total de **${getCrystals.toLocaleString()} [${abbreviate(getCrystals)}]** cristais em seu saldo. é está ocupando **#${IndexPosition} posição** na classificação dos que mais **contém cristais**.`)
        })
    }
}