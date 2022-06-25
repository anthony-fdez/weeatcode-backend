import { Response } from 'express';
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
export const sendToken = async (user: UserAttributesInterface, statusCode: number, res: Response ) => {
  const userClass = new User();
  const token = userClass.getToken(user);
  res.status(statusCode).json({
    success: true,
    token,
    user
  });
  await Token.create({
    userId: user.id,
    token: token
  })
}