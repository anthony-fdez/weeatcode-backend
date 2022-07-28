import jwt from "jsonwebtoken";
import Token from "../../../models/users/Token";

interface NewTokenInterface {
  email: string;
  userId: number | undefined;
}

export const generateToken = async ({ email, userId }: NewTokenInterface) => {
  if (!userId) {
    throw new Error("Undefined id came in the generate token function");
  }

  const token = jwt.sign({ email, userId }, process.env.JWT_SECRET || "");

  await Token.create({
    userId: userId,
    token: token,
  });

  return token;
};
