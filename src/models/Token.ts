import { DataTypes } from "sequelize";
import db from "../db/db";

const Token = db.define(
  "Token",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Tokens",
  }
);

export default Token;
