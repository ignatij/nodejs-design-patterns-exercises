"use strict";

const testComponent = {
  methodA: () => {
    console.log("methodA");
    return Promise.resolve();
  },
  methodB: () => {
    console.log("methodB");
    return Promise.resolve();
  },
  methodC: () => {
    console.log("methodC");
    return Promise.resolve();
  },
  methodD: () => {
    console.log("not proxied!");
  },
  activate: () => {
    console.log("activated!");
  },
};

const proxiedInitialization = (proxiedMethods, activator, obj) => {
  let commandsQueue = [];
  let activated = false;
  return new Proxy(obj, {
    get: (target, prop) => {
      if (activator === prop) {
        activated = true;
        return (...args) => {
          target[prop](...args);
          commandsQueue.forEach((cmd) => {
            cmd();
          });
          commandsQueue = [];
        };
      } else if (proxiedMethods.includes(prop) && !activated) {
        return (...args) =>
          new Promise((resolve, reject) => {
            const cmd = () => target[prop](...args).then(resolve, reject);
            commandsQueue.push(cmd);
          });
      } else {
        return (...args) => target[prop](...args);
      }
    },
  });
};

const proxiedObj = proxiedInitialization(
  ["methodA", "methodB", "methodC"],
  "activate",
  testComponent
);
proxiedObj.methodA();
proxiedObj.methodB();
proxiedObj.methodC();
proxiedObj.methodD();
setTimeout(() => {
  proxiedObj.activate();
}, 5000);
