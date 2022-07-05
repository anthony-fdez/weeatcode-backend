import { logger } from "./../../config/logger";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, NextFunction, Request } from "express";
import Token from "../models/users/Token";
import User from "../models/users/User";

// This auth is for endpoints taht don't necesarilly need the user to be logged in
// but its nice to know that they are logged in and who they are

// For example we want to know if a user has already upvoted a post, and let them know in the
// frontend that they have upvoted it, but for what we need to know who they are.

export interface IUserRequest extends Request {
  user?: {
    userId?: number;
    email: string;
    token: string;
    userName: string;
  };
}

export const AuthOptional = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("authorization");

  // This is the only line that changes from the regular auth

  // old
  // if (!token) return res.json({ status: "err", message: "Please log in" });

  // new
  // No token found but they can still access the data
  if (!token) next();

  try {
    const user: any = await Token.findOne({
      where: { token },
      include: { model: User, attributes: ["email", "name"] },
      raw: true,
    });

    if (!user)
      return res.status(401).send({ status: "err", message: "Please log in" });

    req.user = {
      email: user["User.email"],
      userId: user.userId,
      userName: user["User.name"],
      token: token || "",
    };
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error in auth optional`,
      error,
      service: "authOptional",
    });

    console.log(error);
  }

  return next();
};
