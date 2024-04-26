"use strict";

const proxiedProps = ["log", "info", "error", "debug"];

const consoleProxy = new Proxy(console, {
  get: (target, prop) => {
    if (!proxiedProps.includes(prop)) {
      return target[prop];
    }
    return (...args) => {
      return target[prop](new Date().toISOString(), ...args);
    };
  },
});

// prints with timestamp prefix
consoleProxy.log('hello')
consoleProxy.info('hello')
consoleProxy.debug('hello')
consoleProxy.error('hello')

// prints without timestamp prefix
consoleProxy.warn('hello')