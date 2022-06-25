import jwt from "jsonwebtoken";
import config from "config";
import Token from "../../../models/Token";

interface NewTokenInterface {
  email: string;
  userId: number | undefined;
}

export const generateToken = async ({ email, userId }: NewTokenInterface) => {
  if (!userId) {
    throw new Error("Undefined id came in the generate token function");
  }

  const token = jwt.sign({ email, userId }, config.get("JWT_SECRET"));

  await Token.create({
    userId: userId,
    token: token,
  });

  return token;
};
