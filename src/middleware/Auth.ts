import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "config";

export interface IUserRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

interface JwtPayload {
  userId: number;
  email: string;
}

export const Auth = (req: IUserRequest, res: Response, next: NextFunction) => {
  const token = req.header("authorization");

  if (!token) return res.status(401).send({ err: "Please log in" });

  try {
    // Here i validate the token, but its just using the email and id to do that
    // this way lets say the user deletes their account, that they would still have access
    // if they countinue to use the same token becuase it was never saved in the db

    // I think we should make tokens table, with tokenId, userId and token, and down below
    // we would just query the db, find a token with their userId, and if its the same we let them
    // continuew

    // We are pretty much gonna use the jwt as a key, or a hashed password. We wouln't need to verify the token cause we don't care

    const { email, userId } = jwt.verify(
      token,
      config.get("JWT_SECRET")
    ) as JwtPayload;

    req.user = { email, userId };
  } catch (e) {
    return res.status(401).send({ err: "Please log in" });
  }

  return next();
};
