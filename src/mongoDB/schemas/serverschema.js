const { Schema, model } = require('mongoose');

const Server = new Schema({
    _id: { type: String, required: true },
    prefix: { type: String, default: "-"}
});

module["exports"] = model('Servidores', Server);