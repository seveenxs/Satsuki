const { Schema, model } = require('mongoose');

const User = new Schema({
    _id: { type: String, required: true },
    crystals: { type: Number, default: 0 },
    presents: { type: Object, default: {}},
    premium: { type: Boolean, default: false},

    blacklist: {
        isBlacklisted: { type: Boolean, default: false },
        reason: { type: String, default: 'não há uma razão' },
    },
});

module["exports"] = model('Usuários', User);