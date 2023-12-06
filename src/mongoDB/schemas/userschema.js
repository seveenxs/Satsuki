const { Schema, model } = require('mongoose');

const User = new Schema({
    _id: { type: String, required: true },
    blacklist: Object,
    crystals: Number,
});

module["exports"] = model('Usuários', User);