const { Schema, model } = require('mongoose');

const User = new Schema({
    _id: { type: String, required: true },
    crystals: Number,
    presents: Object,
    blacklist: {
        isBlacklisted: String,
        reason: String,
    },
});

module["exports"] = model('Usuários', User);