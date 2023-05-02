const config = require("config");
const express = require("express");
const app = express();

require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/config")();
require("./startup/db")();
require("./startup/validation")();

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  console.info(`Listening on port ${port}...`)
);

module.exports = server;
