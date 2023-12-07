const { FormatEmoji } = require("../../../functions");
const { hasRegister, IncrementPresent, registerUser } = require("../../../mongoDB/functions/user");

module["exports"] = {
    name: 'verificar',
    infos: {
        description: "Verifique e obtenha acesso aos comandos da Satsuki.",
        category: "utilidades",
        usage: "verificar"
    },
    runner: async (client, message, params) => {
        const status = await hasRegister(message.author.id);
        if (status)
        return message.channel.send(FormatEmoji(`> - {e:database} Ei, **\` ${message.author.username} \`**, não a necessidade de você se verificar **novamente**, verifiquei em meu **banco de dados** e você possui dados nele.`));

        registerUser(message.author.id)
        .then(async () => {
            message.channel.send(FormatEmoji(`> - {e:database} Ei **\` ${message.author.username} \`**, parabéns, você ganhou um {gift01a} **presente prismático** por se verificar, para ver os presentes que você possui use: [ **${client.prefix}presentes** ]`));
            await IncrementPresent(message.author.id, 'prismatic', 1);
        })
        .catch(() => {
            message.channel.send(FormatEmoji(`> - {e:database} Ei **\` ${message.author.username} \`**, não foi possível salvar seus dados em meu **banco de dados**. por favor, **tente novamente**. se o problema **persistir**, entre em contato com meu **suporte**.`))
        })
    }
}