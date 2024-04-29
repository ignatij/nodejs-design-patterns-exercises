"use strict";

const { parentPort } = require("worker_threads");

parentPort.on("message", ({ inputFn, args }) => {
  const parts = args.split(",");

  // using local scope
  const a = parseInt(parts[0]);
  const b = parseInt(parts[1]);
  const result = eval(inputFn);
  parentPort.postMessage({ event: "end", data: result });
});
