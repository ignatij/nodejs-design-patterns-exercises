"use strict";

const { Level } = require("level");
const crypto = require('crypto')

const db = new Level("example-db", { valueEncoding: "json" });
const products = ["book", "game", "app", "song", "movie"];

async function populate() {
  for (let i = 0; i < 100000; i++) {
    await db.put(crypto.randomBytes(24), {
      amount: Math.ceil(Math.random() * 100),
      product: products[Math.floor(Math.random() * 5)],
    });
  }

  console.log("DB populated");
}

populate();
