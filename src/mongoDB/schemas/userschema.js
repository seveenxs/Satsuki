const { Schema, model } = require('mongoose');

const User = new Schema({
    _id: { type: String, required: true },
    crystals: { type: Number, default: 0 },
    hasReputation: { type: Boolean, default: false },
    presents: { type: Object, default: {} },
    cooldowns: { type: Map, of: Date, default: new Map() },
    premium: { type: Boolean, default: false },

    blacklist: {
        isBlacklisted: { type: Boolean, default: false },
        reason: { type: String, default: 'não há uma razão' },
    },

    profile: {
        background: { type: String, default: 'none'},
        aboutme: { type: String, default: 'sem sobre-mim' },
        reputation: { type: Number, default: 0 },
        relationship: { type: String, default: 'ninguém'}
    }
});

module["exports"] = model('Usuários', User);