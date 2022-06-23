import jwt from "jsonwebtoken";
import config from "config";

interface NewTokenInterface {
  email: string;
  userId: number;
}

export const generateToken = ({ email, userId }: NewTokenInterface) => {
  const token = jwt.sign({ email, userId }, config.get("JWT_SECRET"));

  return token;
};
