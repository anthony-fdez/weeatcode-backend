import { Model } from "sequelize";
import { generateToken } from "./../helpers/jwt";
import { logger } from "./../../../../config/logger";
import { hashPassword } from "./../helpers/passwords";
import express, { Router, Request, Response } from "express";
import validator from "validator";
import User from "../../../models/User";
import Token from "../../../models/Token";

const router: Router = express.Router();

interface SignupReqInterface {
  name: string;
  password: string;
  email: string;
}

const signup = router.post("/signup", async (req: Request, res: Response) => {
  try {
    if (!req.body.password) throw new Error("Field 'password' required");
    if (!req.body.email) throw new Error("Field 'email' is required.");
    if (!req.body.name) throw new Error("Field 'name' is required");

    const userInfo: SignupReqInterface = {
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
    };

    if (!validator.isEmail(userInfo.email))
      throw new Error("Invalid 'email' recieved");

    const hashedPassword = await hashPassword({
      textPassword: userInfo.password,
    });

    const user: any = await User.create({
      name: userInfo.name,
      email: userInfo.email,
      password: hashedPassword,
    });

    if (user) {
      logger.log({
        level: "info",
        message: "User Created",
        userInfo: user,
      });

      const generatedToken = generateToken({
        email: user.email,
        userId: user.id,
      });

      await Token.create({
        userId: user.id,
        token: generatedToken,
      });

      return res.send({ msg: "User Created", user, token: generatedToken });
    }
  } catch (err: any) {
    console.log(err);
    res.status(400).send({ error: err.errors });
  }
});

export default signup;
