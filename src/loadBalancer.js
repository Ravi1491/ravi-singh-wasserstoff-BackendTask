import logger from "./logger.js";

class LoadBalancer {
  constructor() {
    this.routes = [];
    this.currentIndex = 0;
  }

  // Method to add a new route to the load balancer
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

  // FIFO load balancing algorithm
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

  // Priority queue load balancing algorithm
  priorityQueue() {
    const healthyRoutes = this.getHealthyRoutes();
    if (healthyRoutes.length === 0) {
      logger.warn("No healthy routes available.");
      return null;
    }

    healthyRoutes.sort((a, b) => b.priority - a.priority); // Sort routes by priority in descending order

    const route = healthyRoutes[0]; // Select the route with the highest priority

    logger.info(`Selected route (Priority Queue): ${route.route}`);
    return route.route;
  }

  // Least load load balancing algorithm
  getLeastLoadedRoute() {
    const healthyRoutes = this.getHealthyRoutes();
    if (healthyRoutes.length === 0) {
      logger.warn("No healthy routes available.");
      return null;
    }

    const route = healthyRoutes.reduce((prev, curr) => {
      return prev.load < curr.load ? prev : curr; // Select the route with the least load
    });

    logger.info(`Selected route (Least Load): ${route.route}`);

    return route.route;
  }

  // Round-robin load balancing algorithm
  roundRobin() {
    const healthyRoutes = this.getHealthyRoutes();
    if (healthyRoutes.length === 0) {
      logger.warn("No healthy routes available.");
      return null;
    }

    const { route } = healthyRoutes[this.currentIndex]; // Select the route at the current index

    this.currentIndex = (this.currentIndex + 1) % healthyRoutes.length; // Increment the index and wrap around if necessary

    logger.info(`Selected route (Round Robin): ${route}`);

    return route;
  }
}

export default LoadBalancer;
