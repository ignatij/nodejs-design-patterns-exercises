"use strict";
const { Buffer } = require("node:buffer");

const createLazyBuffer = (size) => {
  let initialized = false;
  let buffer;
  return new Proxy(
    {},
    {
      get: (target, prop) => {
        if (prop === "write" && !initialized) {
          buffer = Buffer.alloc(size);
          initialized = true;
        }
        if (!initialized) {
          console.warn("Buffer not initialized yet! Call write method first!");
          return () => {};
        }
        return (...args) => buffer[prop](...args);
      },
    }
  );
};

const lazyBuffer = createLazyBuffer(256);
// print three times not initialized yet
lazyBuffer.alloc(29);
lazyBuffer.read(29);
lazyBuffer.of(29);

// write test
lazyBuffer.write("test");

// print test
console.log(lazyBuffer.toString());
