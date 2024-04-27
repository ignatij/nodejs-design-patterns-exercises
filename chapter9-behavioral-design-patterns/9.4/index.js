"use strict";

import fs from "fs/promises";
import chalk from "chalk";

class LoggingManager {
  constructor() {
    this.middlewares = [];
  }

  registerProcessor(processor) {
    this.middlewares.push(processor);
  }

  async process(initialMessage) {
    let message = initialMessage;
    this.middlewares.forEach(async (processor) => {
      message = await processor.process(message);
    });
    return message;
  }
}

const colorizerProcessor = (color) => {
  return {
    process: promisify((msg) => {
      return chalk[color](msg);
    }),
  };
};

const saveToFileProcessor = () => {
  return {
    process: async (msg) => {
      await fs.writeFile("./file.txt", msg);
      return msg;
    },
  };
};

const consoleProcessor = () => {
  return {
    process: (msg) => {
      console.log(msg);
      return msg;
    },
  };
};

const promisify = (fn) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      try {
        const result = fn(...args);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  };
};

const manager = new LoggingManager();
manager.registerProcessor(colorizerProcessor("blue"));
manager.registerProcessor(consoleProcessor());
manager.registerProcessor(saveToFileProcessor());
manager.process("this is a test message");
