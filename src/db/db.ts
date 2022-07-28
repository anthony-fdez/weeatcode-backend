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
  user: process.env.PGUSER || "",
  host: process.env.PGHOST || "",
  database: process.env.PGDATABASE || "",
  password: process.env.PGPASSWORD || "",
  port: parseInt(process.env.PGPORT || "", 10),
  ssl: true,
};

const db = new Sequelize(
  credentials.database,
  credentials.user,
  credentials.password,
  {
    host: credentials.host,
    dialect: "postgres",
    logging: false,
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
