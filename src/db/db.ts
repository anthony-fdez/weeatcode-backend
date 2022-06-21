import { Client, ClientConfig } from "pg";

interface QueryProps {
  sql: string;
}

const credentials: ClientConfig = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT || ""),
  ssl: true,
};

export const query = async ({ sql }: QueryProps) => {
  try {
    const client = new Client(credentials);

    await client.connect();

    const result = await client.query(sql);

    await client.end();

    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
};
