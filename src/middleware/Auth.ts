import { query } from "./../db/db";
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

export const Auth = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("authorization");

  if (!token) return res.status(401).send({ err: "Please log in" });

  try {
    // req.user = { email, userId };
  } catch (e) {
    return res.status(401).send({ err: "Please log in" });
  }

  return next();
};
