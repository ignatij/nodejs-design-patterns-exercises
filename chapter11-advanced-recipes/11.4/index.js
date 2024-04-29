"use strict";

const http = require("http");
const { join } = require("path");
const ThreadPool = require("./ThreadPool");

const workerFile = join(__dirname, "threadWorker.js");
const workers = new ThreadPool(workerFile, 2);

http
  .createServer((req, res) => {
    if (req.method === "POST") {
      const chunks = [];
      req.on("data", (data) => chunks.push(data));
      req.on("end", async () => {
        const data = Buffer.concat(chunks);
        const obj = JSON.parse(data);
        const worker = await workers.acquire();
        worker.postMessage({ inputFn: obj.input, args: obj.args });

        worker.on("message", ({ data }) => {
          workers.release(worker);
          res.end(data.toString());
        });
      });
    }
  })
  .listen(8000, () => {
    console.log("Server started on 8000");
  });

// use the following to test:
/* 
curl --location --request POST 'localhost:8000' \
--header 'Content-Type: application/json' \
--data-raw '{
    "input": "((a, b) => { return a + b })(a, b)",
    "args": "1, 2"
}'
  */
