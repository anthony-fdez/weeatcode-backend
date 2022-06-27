/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { urlencoded } from "express";
import config from "config";

import { logger } from "../config/logger";
import db from "./db/db";
// Routers
import usersRouter from "./api/users/users";
import postsRouter from "./api/posts/posts";
import error from "./middleware/error";

const app = express();
const PORT = config.get("PORT");
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(usersRouter);
app.use(postsRouter);
app.use(error);

const server = app.listen(PORT, async () => {
  try {
    await db.authenticate();
    await db.sync();
    console.log("Connected to db");
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Unable to connect with db: ${error.stack}`,
      error,
      service: "server",
    });
  }

  process.on("unhandledRejection", (err: Error) => {
    logger.log({
      level: "error",
      message: `server shutting down due to unhandled rejection: ${err.stack}`,
      error: err,
      service: "server",
    });

    server.close(() => {
      process.exit(1);
    });
  });
});
