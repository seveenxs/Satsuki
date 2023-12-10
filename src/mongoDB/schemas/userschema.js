const { Schema, model } = require('mongoose');

const User = new Schema({
    _id: { type: String, required: true },
    crystals: { type: Number, default: 0},
    presents: Object,
    premium: { type: Boolean, default: false},
    blacklist: {
        isBlacklisted: String,
        reason: String,
    },

    fishingrod: {
        proficiency: { type: String, default: 'Inciante' },
        durability: { type: Number, default: 100 },
        expMin: { type: Number, default: 0 },
        expMax: { type: Number, default: 1000 },
    }
});

module["exports"] = model('Usuários', User);