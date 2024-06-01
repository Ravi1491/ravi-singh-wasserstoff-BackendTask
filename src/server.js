import express from "express";
import logger from "./logger.js";

const app = express();
app.use(express.json());

const port = 3000;

app.get("/health", (req, res) => {
  res.sendStatus(200);
});

app.listen(port, () => {
  logger.info(`Load balancer server running on port ${port}`);
});
