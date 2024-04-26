"use strict";

const fs = require("fs");
const { dirname, join } = require("path");
const { fileURLToPath } = require("url");
const db = require("./db");
const createFsAdapter = require("./fs-adapter");

// fs.writeFile("file.txt", "Hello!", () => {
//   fs.readFile("file.txt", { encoding: "utf-8" }, (err, res) => {
//     if (err) {
//       console.error(err);
//     }
//     console.log(res);
//   });
// });

// // try to read a missing file
// fs.readFile("missing.txt", { encoding: "utf8" }, (err, res) => {
//   console.error(err);
// });

const fsAdapter = createFsAdapter(db);

fsAdapter.writeFile("file.txt", "Hello!", () => {
  fsAdapter.readFile("file.txt", { encoding: "utf-8" }, (err, res) => {
    if (err) {
      console.error(err);
    }
    console.log(res);
  });
});

// try to read a missing file
fsAdapter.readFile("missing.txt", { encoding: "utf8" }, (err, res) => {
  console.error(err);
});
