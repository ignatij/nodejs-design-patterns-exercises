"use strict";

const { createServer } = require("http");
const portfinder = require("portfinder");
const config = require("./config.json");
const crypto = require("crypto");
const Consul = require("consul");

const main = async () => {
  const port = await portfinder.getPortPromise();
  const db = config[process.argv[2].toUpperCase()];
  const uid = crypto.randomUUID();
  const consulClient = new Consul();
  const serviceType = "server-" + process.argv[2].toUpperCase();

  async function registerService() {
    await consulClient.agent.service.register({
      id: uid,
      name: serviceType,
      address: "localhost",
      port,
      tags: [serviceType],
    });
    console.log(`${serviceType} registered successfully`);
  }

  async function unregisterService(err) {
    err && console.error(err);
    console.log(`deregistering service: ${serviceType}`);
    await consulClient.agent.service.deregister(uid);
    process.exit(err ? 1 : 0);
  }

  process.on("exit", unregisterService);
  process.on("uncaughtException", unregisterService);
  process.on("SIGINT", unregisterService);

  createServer((req, res) => {
    const parts = req.url.split("/");
    const firstLetter = parts[parts.length - 1];
    const items = JSON.parse(JSON.stringify(require(__dirname + "/" + db)));
    const content = items.filter((item) =>
      item.firstName.startsWith(firstLetter.toUpperCase())
    );
    res.end(JSON.stringify(content));
  }).listen(port, () => {
    registerService();
    console.log("server started on port", port);
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
