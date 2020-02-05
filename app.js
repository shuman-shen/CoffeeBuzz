const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/validation")();
require("./startup/prod")(app);

//throw new Error("test new console message");

const port = process.env.PORT || 5000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
