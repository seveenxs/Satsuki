const { userDB } = require("..");


async function hasRegister(id) {
    const data = await userDB.findById(id)
    return !!data
}

async function registerUser(id) {
    const status = await hasRegister(id);
    if (status) return;
    userDB.create({ _id: id });
}

async function getUser(id, keys) {
    const user = await userDB.findById(id)
        const result = keys.reduce((acc, cur) => { return { ...acc, [cur]: user[cur] } }, {});
        if(Object.keys(result).length == 1) return result[keys[0]]
        else return result
}

async function getCooldown(id, type) {
    const status = await hasRegister(id);
    if (!status) return;

    const search = await getUser(id, ["cooldowns"]);
    const result = search.get(type);

    if (!result) return;
    return result
}

async function setCooldown(id, type, value) {
    const status = await hasRegister(id);
    if (!status) return;
    const userCooldown = await userDB.findOneAndUpdate({ _id: id}, { $set: { [`cooldowns.${type}`]:  value } });
    return userCooldown;
}

async function IncrementPresent(id, type, quantity) {
    const status = await hasRegister(id);
    if (!status) return;
    await userDB.findOneAndUpdate({ _id: id}, { $inc: { [`presents.${type}`]: Math.max(0, quantity) } });
}

async function IncrementCrystals(id, quantity) {
    const status = await hasRegister(id);
    if (!status) return;
    await userDB.findOneAndUpdate({ _id: id}, { $inc: { "crystals": quantity } });
}

async function DecrementPresent(id, type, quantity) {
    const status = await hasRegister(id);
    if (!status) return;
    await userDB.findOneAndUpdate({ _id: id}, { $inc: { [`presents.${type}`]: -quantity } });
}

async function DecrementCrystals(id, quantity) {
    const status = await hasRegister(id);
    if (!status) return;
    await userDB.findOneAndUpdate({ _id: id}, { $inc: { "crystals": -quantity } });
}


module["exports"] = {
    hasRegister,
    registerUser,
    getUser,
    IncrementPresent,
    IncrementCrystals,
    DecrementPresent,
    DecrementCrystals,
    setCooldown,
    getCooldown,
    getUser
}