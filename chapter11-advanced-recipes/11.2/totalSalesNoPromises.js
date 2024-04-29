"use strict";

const { Level } = require("level");
const { EventEmitter } = require("events");

const db = new Level("example-db", { valueEncoding: "json" });
const { EntryStream } = require("level-read-stream");

class TotalSales extends EventEmitter {
  constructor() {
    super();
  }

  totalSales(product) {
    let sum = 0;
    const now = Date.now();
    db.open(() => {
      const es = new EntryStream(db);
      es.on("data", ({ value }) => {
        if (!product || product === value.product) {
          sum += value.amount;
        }
      });
      es.on("end", () => {
        console.log(`totalSales() took: ${Date.now() - now}ms`);
        db.close();
        this.emit("done", { product, sum });
      });
    });
  }
}

module.exports = TotalSales;
