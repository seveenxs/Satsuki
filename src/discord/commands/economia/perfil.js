const { createProfile } = require('../../../functions');

module["exports"] = {
    name: 'perfil',
    aliases: ["profile", "p"],
    infos: {
        description: "Veja o perfil do usuário especificado ou o seu.",
        category: "economia",
        usage: "perfil [usuário]"
    },
    runner: async (client, message, params, prefix) => {
        message.channel.send({
            files: [{
                attachment: await createProfile(message, params, client),
                name: `Perfil.png`
            }]
        });        
    }
}