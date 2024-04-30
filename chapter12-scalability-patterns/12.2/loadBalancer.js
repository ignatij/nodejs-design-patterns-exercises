"use strict";

const Consul = require("consul");
const { createServer } = require("http");
const httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer();

const main = () => {
  const consulClient = new Consul();

  const regexBuilder = (regex) => `^[${regex}].*`;

  createServer(async (req, res) => {
    if (req.url.startsWith("/api/people/byFirstName")) {
      const parts = req.url.split("/");
      const firstLetter = parts[parts.length - 1].toUpperCase();
      const foundServiceType = Object.keys(require("./config.json")).find(
        (key) => new RegExp(regexBuilder(key)).test(firstLetter)
      );
      if (foundServiceType) {
        const services = await consulClient.agent.service.list();
        if (services.length === 0) {
          res.writeHead(502);
          return res.end("Bad Gateway!");
        }
        const { Address, Port } =
          Object.values(services).find((service) =>
            service.Service.endsWith(foundServiceType)
          ) || {};
        if (!Address && !Port) {
          console.error("No such service");
          res.writeHead(502);
          return res.end("Bad Gateway!");
        }
        const target = `http://${Address}:${Port}`;
        console.log("Proxying to: ", target);
        proxy.web(req, res, { target });
      }
    }
  }).listen(8081, () => {
    console.log("Load Balancer started on port 8081");
  });
};

main();
