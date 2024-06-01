import express from "express";
import LoadBalancer from "./loadBalancer.js";
import HealthChecker from "./healthChecker.js";
import logger from "./logger.js";
import { applicationConfig } from "../config/index.js";

const app = express();
app.use(express.json());

const port = applicationConfig.port || 3000;
const loadBalancer = new LoadBalancer();

const servers = [
  {
    host:
      applicationConfig.env !== "development"
        ? applicationConfig.loadBalancer.url1
        : "http://localhost:3001",
    port: 3001,
    priority: 1,
  },
  {
    host:
      applicationConfig.env !== "development"
        ? applicationConfig.loadBalancer.url2
        : "http://localhost:3002",
    port: 3002,
    priority: 5,
  },
  {
    host:
      applicationConfig.env !== "development"
        ? applicationConfig.loadBalancer.url3
        : "http://localhost:3003",
    port: 3003,
    priority: 3,
  },
];

servers.forEach((server) => {
  const serverApp = express();
  serverApp.use(express.json());

  serverApp.get("/health", (req, res) => {
    res.sendStatus(200);
  });

  serverApp.get("/", (req, res) => {
    res.send(`Response from server running on port ${server.port}`);
  });

  serverApp.listen(server.port, () => {
    logger.info(`Backend server running on port ${server.port}`);
  });

  // Add server to load balancer
  loadBalancer.addRoute(server.host, server.priority);
});

app.get("/health", (req, res) => {
  res.sendStatus(200);
});

const healthChecker = new HealthChecker(loadBalancer.routes);
healthChecker.start();

app.get("/balance/roundrobin", (req, res) => {
  const route = loadBalancer.roundRobin();
  res.send({
    algorithm: "roundrobin",
    route: route,
  });
});

app.get("/balance/fifo", (req, res) => {
  const route = loadBalancer.fifo();
  res.send({
    algorithm: "fifo",
    route: route,
  });
});

app.get("/balance/priority", (req, res) => {
  const route = loadBalancer.priorityQueue();
  res.send({
    algorithm: "priority",
    route: route,
  });
});

app.get("/balance/leastload", (req, res) => {
  const route = loadBalancer.getLeastLoadedRoute();
  res.send({
    algorithm: "leastload",
    route: route,
  });
});

app.listen(port, () => {
  logger.info(`Load balancer server running on port ${port}`);
});
