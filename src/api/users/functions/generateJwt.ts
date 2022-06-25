import jwt from "jsonwebtoken";
import config from "config";

interface NewTokenInterface {
  email: string;
  userId: number | undefined;
}

export const generateToken = ({ email, userId }: NewTokenInterface) => {
  if (!userId) {
    throw new Error("Undefined id came in the generate token function");
  }

  const token = jwt.sign({ email, userId }, config.get("JWT_SECRET"));

  return token;
};
