import { Response, NextFunction, Request } from "express";
import Token from "../models/Token";
import User, { UserAttributesInterface } from "../models/User";

export interface IUserRequest extends Request {
  user?: {
    userId?: number;
    email: string;
    token: string;
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
    const user = await Token.findOne({
      where: { token },
      include: { model: User, attributes: ["email"] },
    });

    if (!user)
      return res.status(401).send({ status: "err", msg: "Please log in" });

    const userId = user?.get().userId;
    const userEmail = JSON.stringify(User.getAttributes().email);

    req.user = { email: userEmail, userId, token };
  } catch (error) {
    res.status(401).json({ success: false, message: "Please log in" });
    console.log(error);
  }
  return next();
};
