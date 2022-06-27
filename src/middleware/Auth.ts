/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, NextFunction, Request } from "express";
import Token from "../models/users/Token";
import User from "../models/users/User";

export interface IUserRequest extends Request {
  user?: {
    userId?: number;
    email: string;
    token: string;
    userName: string;
  };
}

export const Auth = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("authorization");
  if (!token) return res.json({ success: false, message: "Please log in" });

  try {
    const user: any = await Token.findOne({
      where: { token },
      include: { model: User, attributes: ["email", "name"] },
      raw: true,
    });

    if (!user)
      return res.status(401).send({ status: "err", msg: "Please log in" });

    req.user = {
      email: user["User.email"],
      userId: user.userId,
      userName: user["User.name"],
      token,
    };
  } catch (error) {
    res.status(401).send({
      status: "err",
      message: "Please log in",
    });
    console.log(error);
  }

  return next();
};
