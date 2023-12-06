const { Client, Collection } = require('discord.js');
const Table = require('cli-table3');
const { globSync } = require('glob');
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
            this.#Handler();

            await super.login(this.token);
            console.log(`${this.user.username.magenta.bold} foi conectada com sucesso.`);
        } catch (error) {
            console.error(`Ocorreu um erro ao se conectar com o cliente:`, error);
        }
    }

    #Handler() {
        const dirCommands = `./src/discord/commands/**/*.js`;
        const dirEvents = `./src/discord/events/**/*.js`;
        const dirComponents = `./src/discord/components/**/*.js`;

        const tableCommand = new Table({ head: [colors.cyan('comandos'), colors.blue('status')] });
        const tableEvents = new Table({ head: [colors.cyan('eventos'), colors.blue('status')] });
        const tableComponents = new Table({ head: [colors.cyan('componentes'), colors.blue('status')] });

        globSync(dirCommands).forEach(async (cmdFiles) => {
            const command = require(`../../${cmdFiles}`);
            this.commands.set(command.name, command);

            tableCommand.push([command.name, 'sucesso']);
        });

        globSync(dirEvents).forEach(async (evtFiles) => {
            const event = require(`../../${evtFiles}`);

            if (event.once) this.once(event.type, (...args) => { event.runner(this, ...args) });
            else this.once(event.type, (...args) => { event.runner(this, ...args) });

            tableEvents.push([event.type, 'sucesso']);
        });

        globSync(dirComponents).forEach(async (cmpFiles) => {
            const component = require(`../../${cmpFiles}`);
            this.components.set(component.id, component);

            tableComponents.push([component.id, 'sucesso'])
        });

        console.log(tableCommand.toString());
        console.log(tableEvents.toString())
        console.log(tableComponents.toString())
    }
}