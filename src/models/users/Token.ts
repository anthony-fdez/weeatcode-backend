/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTypes, Model } from "sequelize";
import db from "../../db/db";
import User from "./User";

export interface IToken {
  token: string;
  userId: number;
  createdByTest?: boolean;
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
    createdByTest: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
