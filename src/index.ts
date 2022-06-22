import express from "express";
import config from 'config';
import usersRouter from "./api/users/users";
import { logger } from "../config/logger";

const app = express();
const PORT = config.get('PORT')

app.use(express.json());

app.use(usersRouter);

const server = app.listen(PORT, () => {
  logger.log({
    level: "info",
    message: `listening on port: ${PORT}`,
  });

  process.on("unhandledRejection", (err: Error) => {
    logger.log({
      level: "error",
      message: `server shutting down due to unhandled rejection: ${err.stack}`,
    });

    server.close(() => {
      process.exit(1);
    });
  });
});
