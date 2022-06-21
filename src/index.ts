import "dotenv/config";
import express from "express";
import usersRouter from "./api/users/users";
import { logger } from "../config/logger"
import { query } from "./db/db";


const app = express();
const PORT = 3001;

app.use(usersRouter);

const server = app.listen(PORT, () => {
  logger.log({
    level: 'info',
    message: `listening on port: ${PORT}`
  })
  process.on('unhandledRejection', (err: Error) => {
    logger.log({
      level: 'error',
      message: `server shutting down due to unhandled rejection: ${err.stack}`
    })
    server.close(() => {
      process.exit(1);
    })
  })
});
