const { guildDB } = require ('../index');

async function GuildPrefix(GuildID) {
    let guildPrefix = await guildDB.findOne({ _id: GuildID });

    if (!guildPrefix) {
        await guildDB.create({ _id: GuildID });
        guildPrefix = await guildDB.findOne({ _id: GuildID });
    }

    return guildPrefix.prefix;
}

module["exports"] = {
    GuildPrefix
}