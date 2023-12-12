const { FormatEmoji } = require("../../../functions");
const { guildDB } = require('../../../mongoDB');

module["exports"] = {
    name: 'prefix',
    aliases: ["set-prefix", "prefixo"],
    AuthorPerms: ["ManageMessages"],
    infos: {
        description: "Troque o prefixo da Satsuki",
        category: "moderação",
        usage: "prefix <prefixo>"
    },
    runner: async (client, message, params, prefix) => {
        const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
        const NewPrefix = params[0];

        if (!NewPrefix || NewPrefix.length < 1 || NewPrefix.length > 2 || emojiRegex.test(NewPrefix)) {
            message.channel.send(FormatEmoji(`> - {e:remove} **${message.author.username}**, você precisa fornecer um **prefixo** válido contendo de 1 a 2 caracteres. a utilização correta do comando é: [ **${prefix}prefix \` <prefixo> \`** ].`));
            return;
        }

        await guildDB.updateOne({ _id: message.guild.id }, { $set: { prefix: NewPrefix } })
        .then(() => {
            message.channel.send(FormatEmoji(`> - {e:correct} **${message.author.username}**, o **prefixo** desse servidor foi **alterado** para: [ **${NewPrefix}** ]`));
        })
        .catch(() => {
            message.channel.send(FormatEmoji(`> - {e:remove} **${message.author.username}**, um **erro** ocorreu ao tentar mudar o **prefixo** do servidor. Por favor, tente novamente. se o **problema persistir**, entre em contato com o meu suporte.`));
        })

    }
};
