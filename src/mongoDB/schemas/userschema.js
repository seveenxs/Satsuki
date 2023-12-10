const { Schema, model } = require('mongoose');

const User = new Schema({
    _id: { type: String, required: true },
    crystals: { type: Number, default: 0},
    presents: { type: Object, default: {}},
    premium: { type: Boolean, default: false},

    blacklist: {
        isBlacklisted: { type: Boolean, default: false },
        reason: { type: String, default: 'não há uma razão' },
    },

    vhessels: {
        hasVhessels: { type: Boolean, default: false },
        requiredProficiency: { type: String, default: 'Iniciante' },
        requiredCrystals: { type: Number, default: 12000 },
    },

    fishingrod: {
        proficiency: { type: String, default: 'Inciante' },
        durability: { type: Number, default: 100 },
        expMin: { type: Number, default: 0 },
        expMax: { type: Number, default: 1000 },
    }
});

module["exports"] = model('Usuários', User);