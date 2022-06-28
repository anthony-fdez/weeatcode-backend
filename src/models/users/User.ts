/* eslint-disable class-methods-use-this */
import { Model, DataTypes } from "sequelize";
import config from "config";
import bcrypt from "bcrypt";
import db from "../../db/db";
import Token from "./Token";
import Post from "../posts/Post";
import PostVote from "../posts/PostVote";

/**
 * with interfaces we can call them likes this
 * we can call custom methods in the User class or whatever class extends a sequelize Model
 * interfaces will contain everything the .init() contains if not it will throw errors
 */

export interface UserAttributesInterface {
  name: string;
  email: string;
  password: string;
  createdByTest?: boolean;
  // below are automatically generated by the db
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class User extends Model<UserAttributesInterface> {
  constructor(init?: Partial<User>) {
    super();
    Object.assign(this, init);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    createdByTest: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    hooks: {
      async beforeCreate(data) {
        // this hook helps us create this password hash before it is saved in the database
        // it is a sequelize built in method
        const user = data as unknown as UserAttributesInterface;
        const salt = await bcrypt.genSalt(parseInt(config.get("BCRYPT"), 10));
        user.password = await bcrypt.hash(user.password, salt);
      },
    },
    tableName: "Users",
    freezeTableName: true, // no alter
    sequelize: db,
  }
);

User.hasMany(Token, { foreignKey: "userId" });
User.hasMany(Post, { foreignKey: "authorId" });
User.hasMany(PostVote, { foreignKey: "userId" });

Token.belongsTo(User, { foreignKey: "userId" });

export default User;
