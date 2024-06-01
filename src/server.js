import express from "express";
import LoadBalancer from "./loadBalancer.js";
import HealthChecker from "./healthChecker.js";
import logger from "./logger.js";
import { applicationConfig } from "../config/index.js";
import { servers } from "./constant.js";

const app = express();
app.use(express.json());

const port = applicationConfig.port || 3000;
const loadBalancer = new LoadBalancer();

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

  // Add the server route to the load balancer
  loadBalancer.addRoute(server.host, server.priority);
});

// Health check endpoint for the load balancer
app.get("/health", (req, res) => {
  res.sendStatus(200);
});

// Start the health checker to monitor the health of backend servers
const healthChecker = new HealthChecker(loadBalancer.routes);
healthChecker.start();

// Endpoint to test round-robin load balancing algorithm
app.get("/balance/roundrobin", (req, res) => {
  const route = loadBalancer.roundRobin();
  res.send({
    algorithm: "roundrobin",
    route: route,
  });
});

// Endpoint to test FIFO load balancing algorithm
app.get("/balance/fifo", (req, res) => {
  const route = loadBalancer.fifo();
  res.send({
    algorithm: "fifo",
    route: route,
  });
});

// Endpoint to test priority queue load balancing algorithm
app.get("/balance/priority", (req, res) => {
  const route = loadBalancer.priorityQueue();
  res.send({
    algorithm: "priority",
    route: route,
  });
});

// Endpoint to test least load load balancing algorithm
app.get("/balance/leastload", (req, res) => {
  const route = loadBalancer.getLeastLoadedRoute();
  res.send({
    algorithm: "leastload",
    route: route,
  });
});

// Middleware to apply round-robin load balancing to all incoming requests
function roundRobinMiddleware(req, res, next) {
  const route = loadBalancer.roundRobin();
  req.serverRoute = route;
  next();
}

app.use(roundRobinMiddleware); // Use the round-robin middleware for all routes

// Endpoint to demonstrate the use of the round-robin middleware
app.get("/getUser", (req, res) => {
  res.send(`User API called. Server route: ${req.serverRoute}`);
});

// Root endpoint for the load balancer server
app.get("/", (req, res) => {
  res.send(`Load balancer server running at ${req.serverRoute}`);
});

app.listen(port, () => {
  logger.info(`Load balancer server running on port ${port}`);
});
