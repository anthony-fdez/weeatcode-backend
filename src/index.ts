import "dotenv/config";
import express from "express";
import usersRouter from "./api/users/users";
import { query } from "./db/db";

const app = express();

app.use(usersRouter);

app.listen(3001, () => {
  console.log("App on port 3001");
});
