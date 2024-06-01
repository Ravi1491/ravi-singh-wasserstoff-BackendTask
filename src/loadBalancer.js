import logger from "./logger.js";

class LoadBalancer {
  constructor() {
    this.routes = [];
    this.currentIndex = 0;
  }

  addRoute(route, priority = 1) {
    const routeObj = {
      route,
      priority,
      load: Math.random() * 10 + 1,
      healthy: true,
    };

    this.routes.push(routeObj);

    logger.info(`Added route: ${route} with priority: ${priority}`);
  }

  getHealthyRoutes() {
    return this.routes.filter((route) => route.healthy);
  }

  roundRobin() {
    const healthyRoutes = this.getHealthyRoutes();

    if (healthyRoutes.length === 0) {
      logger.warn("No healthy routes available.");
      return null;
    }

    const { route } = healthyRoutes[this.currentIndex];

    this.currentIndex = (this.currentIndex + 1) % healthyRoutes.length;

    logger.info(`Selected route (Round Robin): ${route}`);

    return route;
  }
}

export default LoadBalancer;
