/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTypes, Model } from "sequelize";
import db from "../db/db";

export interface IToken {
  userId?: number,
  token: any
}

class Token extends Model<IToken>{
  constructor(init?: Partial<Token>){
    super();
    Object.assign(this, init);
  }
}

Token.init(
  {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    token: { type: DataTypes.STRING, allowNull: false }
  },
  {
    tableName: 'Tokens',
    freezeTableName: true,
    underscored: true,
    sequelize: db,
  }
)
export default Token;