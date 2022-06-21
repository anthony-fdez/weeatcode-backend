import "dotenv/config";
import express from "express";
import { query } from "./db/db";

const app = express();

app.get("/", async (req, res) => {
  console.log("1");

  const result = await query({ sql: "SELECT * FROM users" });

  console.log(result);

  res.send();
});

app.listen(3001, () => {
  console.log("App on port 3001");
});
