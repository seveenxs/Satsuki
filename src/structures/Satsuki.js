const { Client, Collection } = require('discord.js');
const Table = require('cli-table3');
const fs = require('fs')
const colors = require('colors');

module["exports"] = class Satsuki extends Client {
    constructor(options) {
        super({
            intents: options.intents
        });

        this.prefix = options.prefix;
        this.developers = options.developers || [];
        this.token = options.token

        this.commands = new Collection();
        this.components = new Collection();
        this.cooldowns = new Collection();
    }

    async setup() {
        try {
            this.#HandlerCommands();
            this.#HandlerEvents()
            this.#HandlerComponents();

            await super.login(this.token);
            console.log(`${this.user.username.magenta.bold} foi conectada com sucesso.`);
        } catch (error) {
            console.error(`Ocorreu um erro ao se conectar com o cliente:`, error);
        }
    }

    #HandlerCommands() {
        const table = new Table({ head: [colors.cyan('comandos'), colors.blue('status')] });

        fs.readdirSync('./src/discord/commands').forEach(directory => {
            const commandFiles = fs.readdirSync(`./src/discord/commands/${directory}/`).filter(cmdFile => cmdFile.endsWith(".js"));
    
            commandFiles.forEach(file => {
                const command = require(`../discord/commands/${directory}/${file}`);
                if (!command) return;
    
                this.commands.set(command.name, command);

                table.push([command.name.white, 'sucesso'.white])
            });
        });

        console.log(table.toString());
    }

    #HandlerEvents () {
        const table = new Table({ head: [colors.cyan('eventos'), colors.blue('status')] });

        fs.readdirSync('./src/discord/events').forEach(files => {
            const events = require(`../discord/events/${files}`);
            if (!events.type) return;

            if (events.once) {
                this.once(events.type, (...args) => {
                    events.runner(this, ...args);
                })
            } else {
                this.on(events.type, (...args) => {
                    events.runner(this, ...args);
                })
            }
            table.push([events.type.white, 'sucesso'.white])
        });

        console.log(table.toString());
    }

    #HandlerComponents () {
        const table = new Table({ head: [colors.cyan('componentes'), colors.blue('status')] });

        fs.readdirSync('./src/discord/components').forEach(directory => {
            const componentFile = fs.readdirSync(`./src/discord/components/${directory}/`).filter(cmpFile => cmpFile.endsWith(".js"));

            componentFile.forEach(file => {
                const components = require(`../discord/components/${directory}/${file}`);
                if (!components) return;

                if (!components || !Array.isArray(components)) return;

                components.forEach(component => {
                this.components.set(component.id, component);
                table.push([component.id.white, 'sucesso'.white])
                });
            });
        });

        console.log(table.toString())
    }
}