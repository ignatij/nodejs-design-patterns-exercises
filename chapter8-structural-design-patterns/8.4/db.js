"use strict";

module.exports = {
  _map: {},
  get(key, encoding, cb) {
    if (this._map[key]) {
      cb(null, this._map[key]);
    } else {
      const err = {
        type: "NotFoundError",
      };
      cb(err, null);
    }
  },
  put(key, contents, encoding, cb) {
    this._map[key] = contents;
    cb();
  },
};
