import { applicationConfig } from "../config/index.js";

export const servers = [
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
