"use strict";

const { resolve } = require("path");

const createFsAdapter = (db) => {
  return {
    readFile(filename, options, cb) {
      if (typeof options === "function") {
        cb = options;
      } else if (typeof options === "string") {
        options = {
          encoding: options,
        };
      }
      db.get(
        resolve(filename),
        {
          valueEncoding: options.encoding,
        },
        (err, value) => {
          if (err) {
            if (err.type === "NotFoundError") {
              err = new Error(`ENOENT, open "${filename}"`);
              err.code = "ENOENT";
              err.errno = 34;
              err.path = filename;
            }
            return cb && cb(err);
          }
          return cb && cb(null, value);
        }
      );
    },
    writeFile(filename, contents, options, cb) {
      if (typeof options === "function") {
        cb = options;
      } else if (typeof options === "string") {
        options = {
          encoding: options,
        };
      }
      db.put(
        resolve(filename),
        contents,
        {
          valueEncoding: options.encoding,
        },
        cb
      );
    },
  };
};


module.exports = createFsAdapter