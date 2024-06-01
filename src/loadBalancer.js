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

  fifo() {
    const healthyRoutes = this.getHealthyRoutes();

    if (healthyRoutes.length === 0) {
      logger.warn("No healthy routes available.");
      return null;
    }

    const route = healthyRoutes.shift();

    healthyRoutes.push(route);

    logger.info(`Selected route (FIFO): ${route.route}`);

    return route.route;
  }

  priorityQueue() {
    const healthyRoutes = this.getHealthyRoutes();

    if (healthyRoutes.length === 0) {
      logger.warn("No healthy routes available.");
      return null;
    }

    healthyRoutes.sort((a, b) => b.priority - a.priority);

    const route = healthyRoutes[0];

    logger.info(`Selected route (Priority Queue): ${route.route}`);
    return route.route;
  }

  getLeastLoadedRoute() {
    const healthyRoutes = this.getHealthyRoutes();

    if (healthyRoutes.length === 0) {
      logger.warn("No healthy routes available.");
      return null;
    }

    const route = healthyRoutes.reduce((prev, curr) => {
      console.log("PREV ", prev);
      console.log("CURR ", curr);
      return prev.load < curr.load ? prev : curr;
    });

    logger.info(`Selected route (Least Load): ${route.route}`);

    return route.route;
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
