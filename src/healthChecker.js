import axios from "axios";
import logger from "./logger.js";

class HealthChecker {
  constructor(routes) {
    this.routes = routes;
    this.interval = 10000;
  }

  async checkHealth() {
    for (const route of this.routes) {
      try {
        await axios.get(`${route.route}/health`);
        route.healthy = true;
        logger.info(`Route ${route.route} is healthy.`);
      } catch (error) {
        route.healthy = false;
        logger.warn(`Route ${route.route} is unhealthy.`);
      }
    }
  }

  start() {
    this.checkHealth();
    setInterval(() => this.checkHealth(), this.interval);
  }
}

export default HealthChecker;
