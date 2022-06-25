/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTypes, Model } from "sequelize";
import db from "../db/db";

export interface IToken {
  token: string;
  userId: number;
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Token extends Model<IToken> {
  constructor(init?: Partial<Token>) {
    super();
    Object.assign(this, init);
  }
}

Token.init(
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
    underscored: false,
    freezeTableName: true,
    sequelize: db,
  }
);

export default Token;
