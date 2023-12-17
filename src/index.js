const Satsuki = require('./structures/Satsuki');
require("dotenv").config();

const client = new Satsuki({
        intents: 122627,
        prefix: "-",
        developers: ["1170153272984739893", "1005290241743143043", "929182434120065065", "903186158937325569"],
        token: process.env.token
});

client.setup();
require('./mongoDB');

process
  .on("uncaughtException", (err) => console.log(err))

  .on("unhandledRejection", (err) => console.log(err));