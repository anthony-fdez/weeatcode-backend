import db from "./../db/db";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "config";
import User from "../models/User";
import Token from "../models/Token";

export interface IUserRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

export const Auth = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("authorization");

  if (!token) return res.status(401).send({ err: "Please log in" });

  try {
    User.hasMany(Token, {
      foreignKey: "userId",
    });
    Token.belongsTo(User);

    const user: any = await Token.findOne({
      where: {
        token,
      },
      include: User,
    });

    const userId = user.dataValues.userId;
    const userEmail = user.dataValues.user.dataValues.email;

    req.user = { email: userEmail, userId };
  } catch (e) {
    return res.status(401).send({ err: "Please log in" });
  }

  return next();
};
