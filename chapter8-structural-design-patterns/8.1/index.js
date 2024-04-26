"use strict";

const axios = require("axios");

const httpProxy = () => {
  const _cache = {};
  return {
    get: async (url) => {
      if (_cache[url]) {
        console.log("cache hit");
        return _cache[url];
      }
      console.log("new call");
      const response = await axios.get(url);
      _cache[url] = response.data;
      return response.data;
    },
  };
};

const http = httpProxy();
async function test() {
  // this should log 'new call'
  await http.get("https://google.com");
  // this should log 'cache hit'
  await http.get("https://google.com");
  // this should log 'new call'
  await http.get("https://facebook.com");
}

test();
