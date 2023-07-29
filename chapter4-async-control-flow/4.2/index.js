"use strict";
const fs = require("fs");
const path = require("path");

let running = 1;
const result = [];
const listNestedFiles = (dir, cb) => {
  if (running === 0) {
    return cb(null, result);
  }
  fs.readdir(dir, "utf-8", (err, files) => {
    if (err) {
      return cb(err);
    }
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      fs.lstat(dir + "/" + file, (err, stats) => {
        if (err) {
          return cb(err);
        }
        if (stats.isDirectory()) {
          running++;
          process.nextTick(() => listNestedFiles(dir + "/" + file, cb));
        } else {
          result.push(file);
        }
        if (i === files.length - 1) {
          running--;
        }
        if (i === files.length - 1 && running === 0) {
          cb(null, result);
        }
      });
    }
  });
};

const listNestedFilesPromisified = async (dir, cb) => {
  try {
    const result = await recursivelyFind(dir);
    return cb(null, result.flat(Infinity));
  } catch (err) {
    cb(err);
  }
};

const fsPromisified = require("fs/promises");
const recursivelyFind = async (dir) => {
  try {
    const files = await fsPromisified.readdir(dir, "utf-8");
    return Promise.all(
        files.map((file) => recursivelyFind(path.join(dir, file)))
    );
  } catch (err) {
    if (err.code === "ENOTDIR") {
      return path.basename(dir);
    }
    throw new Error("Somethin went wrong ", err);
  }
};

listNestedFilesPromisified(
  "../",
  (err, dat) => {
    if (err) {
      console.log(err);
    }
    console.log(dat.length);
  }
);
