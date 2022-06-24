import { generateToken } from "./../helpers/jwt";
import { compareHashedPassword } from "./../helpers/passwords";
import db from "./../../../db/db";
import express, { Router, Request, Response } from "express";
import User from "../../../models/User";
import Token from "../../../models/Token";

const router: Router = express.Router();

interface LoginInterface {
  email: string;
  password: string;
}

const login = router.post("/login", async (req: Request, res: Response) => {
  try {
    if (!req.body.password) throw new Error("Field 'password' required");
    if (!req.body.email) throw new Error("Field 'email' is required.");

    const userInfo: LoginInterface = {
      email: req.body.email,
      password: req.body.password,
    };

    const user: any = await User.findOne({
      where: {
        email: userInfo.email,
      },
      attributes: ["password", "id"],
    });

    if (!user) return res.status(400).send({ error: "User not found" });

    const passwordsMatch = await compareHashedPassword({
      textPassword: userInfo.password,
      hash: user.password,
    });

    if (!passwordsMatch) {
      return res.send({ err: "Invalid 'email' or 'password'" });
    }

    const generatedToken = generateToken({
      email: userInfo.email,
      userId: user.id,
    });

    await Token.create({ userId: user.id, token: generatedToken });

    return res.send({
      msg: "Logged in successfully",
      generatedToken,
    });
  } catch (e) {
    res.status(500).send({ e });
  }
});

export default login;
