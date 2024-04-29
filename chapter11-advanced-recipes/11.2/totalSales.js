"use strict";

const { Level } = require("level");

const db = new Level("example-db", { valueEncoding: "json" });

const totalSales = async (product) => {
  let sum = 0;
  const now = Date.now();
  for await (const [key, value] of db.iterator()) {
    if (!product || product === value.product) {
      sum += value.amount;
    }
  }
  console.log(`totalSales() took: ${Date.now() - now}ms`);
  return sum;
};

module.exports = totalSales;
