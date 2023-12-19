const Satsuki = require('./structures/Satsuki');
require("dotenv").config();

const client = new Satsuki({
        intents: 122627,
        prefix: "-",
        developers: ["1170153272984739893"],
        token: process.env.token
});

client.setup();
require('./mongoDB');

process
  .on("uncaughtException", (err) => console.log(err))

  .on("unhandledRejection", (err) => console.log(err));