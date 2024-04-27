"use strict";
const fs = require("fs");

class LoggingComponent {
  debug() {
    throw new Error("Should be used from concrete sub-class!");
  }
  info() {
    throw new Error("Should be used from concrete sub-class!");
  }
  warn() {
    throw new Error("Should be used from concrete sub-class!");
  }
  error() {
    throw new Error("Should be used from concrete sub-class!");
  }
}

class ConsoleLogger extends LoggingComponent {
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

class FileLogger {
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

let loggingComponent = new ConsoleLogger();
loggingComponent.info("This is written in console");
loggingComponent.debug("This is written in console");
loggingComponent.warn("This is written in console");

loggingComponent = new FileLogger();
loggingComponent.info("This is written in file");
loggingComponent.debug("This is written in file");
loggingComponent.warn("This is written in file");
