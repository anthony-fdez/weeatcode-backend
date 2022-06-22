import { logger } from "./../../config/logger";
import { Response } from "express";
import { Client, ClientConfig } from "pg";
import config from "config";

interface QueryProps {
  sql: string;
  res: Response;
}

const credentials: ClientConfig = {
  user: config.get("PGUSER"),
  host: config.get("PGHOST"),
  database: config.get("PGDATABASE"),
  password: config.get("PGPASSWORD"),
  port: parseInt(config.get("PGPORT") || ""),
  ssl: true,
};

export const query = async ({ sql, res }: QueryProps) => {
  try {
    const client = new Client(credentials);
    await client.connect();

    const result = await client.query(sql);

    await client.end();

    return result;
  } catch (err: any) {
    logger.log({
      level: "error",
      message: "SQL error",
      error: err,
      service: "db",
    });

    res.status(400).send({ error: err });
    return null;
  }
};
