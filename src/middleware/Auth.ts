/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, NextFunction, Request } from 'express';
import Token from '../models/Token';
import User, { UserAttributesInterface } from '../models/User';
/**
 *
 * @param user
 * @param statusCode
 * @param res
 * this middleware will create a token and send it with the user
 * here we can send the token and create a token table at the same time
 */
export interface IUserRequest extends Request {
  user?: {
    userId?: number,
    email: string
  }
}
export const sendToken = async (user: UserAttributesInterface, statusCode: number, res: Response) => {
  const userClass = new User();
  const token = userClass.getToken(user);
  res.status(statusCode).json({
    success: true,
    generatedToken: token,
  });
  await Token.create({
    userId: user.id!,
    token,
  });
};

export const Auth = async (req: IUserRequest, res: Response, next: NextFunction) => {
  const token = req.header('authorization');
  if (!token) return res.json({ success: false, message: 'Please log in' });
  try {
    const user = await Token.findOne({ where: { token }, include: { model: User, attributes: ['email'] } });
    const userId = user?.get().userId;
    const userEmail = JSON.stringify(User.getAttributes().email);

    req.user = { email: userEmail, userId };
  } catch (error) {
    res.status(401).json({ success: false, message: 'Please log in' });
    console.log(error);
  }
  return next();
};
