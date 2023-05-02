const config = require("config");
const express = require("express");
const app = express();

require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/config")();
require("./startup/db")();
require("./startup/validation")();
const port = process.env.PORT || config.get("port");
httpServer.listen(port, () => console.info(`Listening on port ${port}...`));
