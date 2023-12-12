const { FormatEmoji } = require("../../../functions");
const { hasRegister, IncrementCrystals, registerUser } = require("../../../mongoDB/functions/user");

module["exports"] = {
    name: 'verificar',
    infos: {
        description: "Verifique e obtenha acesso aos comandos da Satsuki.",
        category: "utilidades",
        usage: "verificar"
    },
    runner: async (client, message, params, prefix) => {
        const status = await hasRegister(message.author.id);
        if (status)
        return message.channel.send(FormatEmoji(`> - {e:remove} Ei, **${message.author.username}**, não a **necessidade de você** se verificar novamente, verifiquei em meu **banco de dados** e você possui dados nele.`));

        registerUser(message.author.id)
        .then(async () => {
            const randomCristal = Math.max(1000, Math.floor(Math.random() * 8000));


            message.channel.send(FormatEmoji(`> - {e:correct} Ei, **${message.author.username}**, a sua **verificação** foi **bem-sucedida**, e como recompensa por você se **verificar** você ganhou **({cristais}) ${randomCristal.toLocaleString()} cristais**.`));
            await IncrementCrystals(message.author.id, randomCristal);
        })
        .catch(() => {
            message.channel.send(FormatEmoji(`> - {e:remove} Ei, **${message.author.username}**, a sua **verificação** foi **mal-sucedida**. por favor, **tente novamente**. se o problema persistir, entre em **contato** com meu **suporte**.`))
        })
    }
}