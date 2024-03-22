import { start } from "@gridql/mongo-event-builder";
import { init } from "@gridql/mongo-event-builder/lib/config.js";
import fs from "fs";

import Log4js from "log4js";

Log4js.configure({
  appenders: {
    out: {
      type: "stdout",
    },
  },
  categories: {
    default: { appenders: ["out"], level: "info" },
  },
});

const logger = Log4js.getLogger("db-events");

let configPath = "./config/config.conf";

if (fs.existsSync(configPath)) {
  init(configPath).then((config) => {
    logger.info(`Configuration found: ${config}`);

    start(config).catch((err) => {
      logger.error(`Failed to start: ${JSON.stringify(err)}`);
    });
  });
} else {
  logger.error("Config missing");
}
