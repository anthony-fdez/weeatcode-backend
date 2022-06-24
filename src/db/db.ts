import config from "config";
import { Sequelize } from "sequelize";

interface ICredentials {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
  ssl: boolean;
}

const credentials: ICredentials = {
  user: config.get("PGUSER"),
  host: config.get("PGHOST"),
  database: config.get("PGDATABASE"),
  password: config.get("PGPASSWORD"),
  port: parseInt(config.get("PGPORT") || ""),
  ssl: true,
};

const db = new Sequelize(
  credentials.database,
  credentials.user,
  credentials.password,
  {
    host: credentials.host,
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
    },
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
  }
);

export default db;
