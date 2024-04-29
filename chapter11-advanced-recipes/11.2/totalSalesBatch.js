"use strict";

const runningRequests = new Map();
const totalSalesRaw = require("./totalSales");

const totalSales = async (product) => {
  if (runningRequests.has(product)) {
    return runningRequests.get(product);
  }

  const totalSalesPromise = totalSalesRaw(product);
  runningRequests.set(product, totalSalesPromise);

  totalSalesPromise.finally(() => {
    runningRequests.delete(product);
  });

  return totalSalesPromise;
};

module.exports = totalSales;
