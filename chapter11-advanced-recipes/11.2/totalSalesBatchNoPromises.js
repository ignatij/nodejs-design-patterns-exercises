"use strict";

const runningRequests = new Map();
const TotalSalesRaw = require("./totalSalesNoPromises");
const { EventEmitter } = require("./totalSalesNoPromises");


class TotalSales extends EventEmitter {
  runningRequests = new Map();

  constructor() {
    super();
  }

  totalSales(product) {
    let totalSalesEmitter = null;
    if (runningRequests.has(product)) {
      totalSalesEmitter = runningRequests.get(product);
    } else {
      totalSalesEmitter = new TotalSalesRaw();
      totalSalesEmitter.totalSales(product);
      runningRequests.set(product, totalSalesEmitter);
    }

    totalSalesEmitter.on("done", (data) => {
      runningRequests.delete(product);
      this.emit('done', data)
    });

  }
}

module.exports = TotalSales;
