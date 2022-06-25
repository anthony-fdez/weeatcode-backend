import { generateToken } from "./../functions/generateJwt";
import express, { Router, Request, Response } from "express";
import { logger } from "../../../../config/logger";
import User, { UserAttributesInterface } from "../../../models/User";
import validator from "validator";

const router: Router = express.Router();

const signup = router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !name || !password) {
      return res
        .status(400)
        .send({ err: "'email', 'name' and 'password' fields are required" });
    }

    // This will verify the email is valid
    if (!validator.isEmail(email)) throw new Error("Invalid 'email' recieved");

    const user: UserAttributesInterface = (await User.create({
      name,
      email,
      password,
    })) as unknown as UserAttributesInterface;

    const token = generateToken({ email: user.email, userId: user.id });

    res.send({
      status: "ok",
      msg: "User Created",
      token,
    });
  } catch (err: any) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(404).send({
        status: "err",
        message: "Email already in use",
      });
    }

    res.status(400).send({ err });
  }
});

export default signup;
