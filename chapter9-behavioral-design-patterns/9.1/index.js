"use strict";
const fs = require("fs");

const createLoggingComponent = (loggingStrategy) => ({
  debug(msg) {
    loggingStrategy.debug(msg);
  },
  info(msg) {
    loggingStrategy.info(msg);
  },
  warn(msg) {
    loggingStrategy.warn(msg);
  },
  error(msg) {
    loggingStrategy.error(msg);
  },
});

class ConsoleStrategy {
  constructor() {}
  debug(msg) {
    console.debug(msg);
  }
  info(msg) {
    console.info(msg);
  }
  warn(msg) {
    console.warn(msg);
  }
  error(msg) {
    console.error(msg);
  }
}

class FileStrategy {
  #ws = null;
  constructor(filename) {
    this.filename = filename;
    this.#ws = fs.createWriteStream("./log.txt", { flags: "a" });
  }
  debug(msg) {
    this.#ws.write("DEBUG " + msg + "\n");
  }
  info(msg) {
    this.#ws.write("INFO " + msg + "\n");
  }
  warn(msg) {
    this.#ws.write("WARN " + msg + "\n");
  }
  error(msg) {
    this.#ws.write("ERROR " + msg + "\n");
  }
}

let loggingComponent = createLoggingComponent(new ConsoleStrategy());
loggingComponent.info("This is written in console");
loggingComponent.debug("This is written in console");
loggingComponent.warn("This is written in console");

loggingComponent = createLoggingComponent(new FileStrategy());
loggingComponent.info("This is written in file");
loggingComponent.debug("This is written in file");
loggingComponent.warn("This is written in file");
