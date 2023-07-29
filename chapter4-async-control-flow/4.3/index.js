"use strict";
const fs = require("fs");
const path = require("path");

const result = [];
let running = 1;
const recursiveFind = (dir, keyword, cb) => {
  fs.readdir(dir, "utf-8", (err, files) => {
    if (err) {
      return cb(err);
    }
    files.forEach((file, index) => {
      fs.lstat(path.join(dir, file), (err, stats) => {
        if (err) {
          return cb(err);
        }
        if (stats.isDirectory()) {
          running++;
          process.nextTick(() =>
            recursiveFind(path.join(dir, file), keyword, cb)
          );
          if (index === files.length - 1) {
            running--;
          }
        } else {
          fs.readFile(path.join(dir, file), "utf-8", (err, data) => {
            if (err) {
              return cb(err);
            }
            if (data.includes(keyword)) {
              result.push(path.join(dir, file));
            }
            if (index === files.length - 1) {
              running--;
            }
            if (index === files.length - 1 && running === 0) {
              return cb(null, result);
            }
          });
        }
      });
    });
  });
};

const fsPromisified = require("fs/promises");
const promisifiedRecursiveFind = async (dir, keyword, cb) => {
  try {
    const result = await recursive(dir, keyword);
    return cb(null, result.flat(Infinity).filter(Boolean));
  } catch (err) {
    return cb(err);
  }
};

const recursive = async (dir, keyword) => {
  try {
    const files = await fsPromisified.readdir(dir, "utf-8");
    return Promise.all(
      files.map((file) => recursive(path.join(dir, file), keyword))
    );
  } catch (err) {
    if (err.code === "ENOTDIR") {
      const content = await fsPromisified.readFile(dir, "utf-8");
      if (content.includes(keyword)) {
        return dir;
      }
    } else {
      throw err;
    }
  }
};

promisifiedRecursiveFind(
  "../",
  "Batman",
  (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  }
);
