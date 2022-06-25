import {  Model, DataTypes } from "sequelize";
import config from 'config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../db/db';
import Token from "./Token";

/**
 * with interfaces we can call them likes this
 * we can call custom methods in the User class or whatever class extends a sequelize Model
 * interfaces will contain everything the .init() contains if not it will throw errors
 */
export interface UserAttributesInterface {
  id?: number;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class User extends Model<UserAttributesInterface>{ 
  constructor(init?: Partial<User>){
    super();
    Object.assign(this, init);
  }
  // creates a token and uses an algorithm to encrypt the token
  public  getToken({ id, email}: UserAttributesInterface) {
    return jwt.sign({ id, email }, config.get('JWT_SECRET'), { algorithm: config.get('ALGORITHM')});
  }

//your comparepassword method but inside the class
  public compareHashedPassword = async(textPassword: string, { password }: UserAttributesInterface) => {
    return await bcrypt.compare(textPassword, password);
  }
}

User.init(
  {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
  },
  {
    hooks: {
      beforeCreate: async function (data) { 
        //this hook helps us create this password hash before it is saved in the database
        //it is a sequelize built in method 
        const user = data as unknown as UserAttributesInterface;
        const salt = await bcrypt.genSalt(parseInt(config.get('BCRYPT'), 10));
        user.password = await bcrypt.hash(user.password, salt); 
      }
    },
    tableName: 'Users',
    freezeTableName: true, // no alter
    sequelize: db
  },

)

User.hasMany(Token, { foreignKey: 'userId'});
Token.belongsTo(User, {  foreignKey: 'userId'});
export default User;

