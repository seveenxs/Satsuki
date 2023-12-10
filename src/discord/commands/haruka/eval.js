const { inspect } = require('util');
const { exec } = require('child_process');

module.exports = {
    name: 'eval',
    aliases: ["e", "ev", "evaldro", "evandro", "edivaldo", "escovaldo"],
    devops: true,
    AuthorPerms: ['Administrator'],
    category: 'desenvolvedor',
    runner: async (client, message, args) => {
        try {
            const code = args.join(" ");

            // Verificações para comandos perigosos
            const comandosPerigosos = ["process.exit", "client.leave", "shutdown", "eval", "process"];

            for (const comandoPerigoso of comandosPerigosos) {
                if (code.includes(comandoPerigoso) && message.author.id !== "1170153272984739893") {
                    return message.channel.send(`Execução do comando "${comandoPerigoso}" proibida.`);
                }
            }

            const evaled = eval(code);

            if (evaled instanceof Promise) await evaled;

            const formattedResult = inspect(evaled, { depth: 1 }).substring(0, 1990);

            message.channel.send(`\`\`\`js\n${formattedResult}\`\`\``);
        } catch (error) {
            message.channel.send(`\`\`\`js\n${error}\`\`\``);
        }
    }
};
