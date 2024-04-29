"use strict";
const http = require("http");
// const totalSales = require("./totalSales");
const totalSales = require("./totalSalesBatch");
// const totalSales = require("./totalSalesCache");

// const TotalSales = require("./totalSalesNoPromises");
// const TotalSales = require("./totalSalesBatchNoPromises");
const TotalSales = require("./totalSalesCacheNoPromises");

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    const product = url.searchParams.get("product");
    const obj = new TotalSales();
    obj.totalSales(product);
    obj.on("done", ({ product, sum }) => {
      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      res.end(JSON.stringify({ product, sum }));
    });
  })
  .listen(8000, () => {
    console.log("Server started on 8000");
  });
