const Satsuki = require('./structures/Satsuki');
require("dotenv").config();

const client = new Satsuki({
        intents: 65043,
        prefix: "$",
        developers: ["1170153272984739893"],
        token: process.env.token
});

client.setup();
require('./mongoDB');