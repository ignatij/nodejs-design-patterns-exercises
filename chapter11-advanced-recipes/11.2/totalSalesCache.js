"use strict";
const totalSales = require("./totalSales");
const cache = new Map();

module.exports = async (product) => {
  if (cache.has(product)) {
    return cache.get(product);
  }

  const promise = totalSales(product);
  cache.set(product, promise);

  promise.then(() => {
    setTimeout(() => {
      cache.delete(product);
    }, 3000);
  });

  return promise;
};
