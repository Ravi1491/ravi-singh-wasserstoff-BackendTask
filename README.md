# Load Balancer In NodeJs

#### Youtube Link: https://youtu.be/vupv8GvQ4Ww

#### Deploy Url: https://ravi-singh-wasserstoff-backendtask.onrender.com

#### Postman Collection Url: https://www.postman.com/orange-robot-324607/workspace/team-workspace/collection/17761741-8cdf29a4-5b40-4cfc-b122-373df3220be7?action=share&creator=17761741&active-environment=17761741-942b1c46-3df8-4553-afda-49279ee4f718

#### Note: In Postman, Please change the environment to Prod if not running locally.

# Project Functionality

This project demonstrates a Load Balancer implemented in Node.js, which distributes incoming requests to multiple backend servers using different load-balancing algorithms. The load balancer supports four algorithms: Round Robin, FIFO, Priority Queue, and Least Load.

## Key Components

1. LoadBalancer Class:

   - Manages a list of server routes.
   - Distributes requests using various algorithms.
   - Includes methods: roundRobin, fifo, priorityQueue, and getLeastLoadedRoute.

2. HealthChecker Class:

   - Periodically checks the health of backend servers.
   - Marks servers as healthy or unhealthy based on their responses.

3. Logger

   - Logs server activities and health status.

4. Load-Balancing Algorithms
   - Round Robin: Distributes requests in a circular order to each server.
   - FIFO (First In, First Out): Selects the first healthy server and moves it to the end of the list.
   - Priority Queue: Selects the server with the highest priority.
   - Least Load: Selects the server with the smallest load value.

## API EndPoints

1. Health Check:

   - GET /health: Checks the health of the load balancer.

2. Load Balancing Algorithms:
   - GET /balance/roundrobin: Uses the Round Robin algorithm to select a server.
   - GET /balance/fifo: Uses the FIFO algorithm to select a server.
   - GET /balance/priority: Uses the Priority Queue algorithm to select a server.
   - GET /balance/leastload: Uses the Least Load algorithm to select a server.
3. User API:

- GET /getUser: Middleware applies the Round Robin algorithm to select a server and returns the selected server's route.

### Running Locally

To run the project locally, follow these steps:

1. Clone the repository.
2. Install dependencies using npm install.
3. Start the backend servers: npm run start.
4. Use Postman or a web browser to interact with the endpoints.

### Deployment

The project is deployed on Render, with the load balancer and backend servers running as separate services. Make sure to update the URLs in the configuration for production deployment.
