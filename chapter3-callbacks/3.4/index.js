const { EventEmitter } = require("events");

const ticker = (time, cb) => {
  const emitter = new EventEmitter();
  let ticks = 0;
  process.nextTick(() => emitter.emit("start"));
  if (time % 5 === 0) {
    emitter.emit("error", "Dividing by 5");
    return
  }

  const interval = setInterval(() => {
    if (Date.now() % 5 === 0) {
      emitter.emit("error", "Dividing by 5");
    }
    emitter.emit("tick");
    ticks++;
  }, 50);
  setTimeout(() => {
    clearInterval(interval);
    cb(ticks);
  }, time);
  return emitter;
};

const emitter = ticker(324, (ticks) => {
  console.log("total number of ticks ", ticks);
});
emitter.on("tick", () => {
  console.log("tick");
});

emitter.on("start", () => {
  console.log("start called");
});
emitter.on("error", (e) => {
  console.error("Error happened", e);
});
