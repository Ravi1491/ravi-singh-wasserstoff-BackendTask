import express from "express";
import LoadBalancer from "./loadBalancer.js";
import HealthChecker from "./healthChecker.js";
import logger from "./logger.js";

const app = express();
app.use(express.json());

const port = 3000;
const loadBalancer = new LoadBalancer();

const servers = [
  { port: 3001, priority: 1 },
  { port: 3002, priority: 5 },
  { port: 3003, priority: 3 },
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
  loadBalancer.addRoute(`http://localhost:${server.port}`, server.priority);
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
