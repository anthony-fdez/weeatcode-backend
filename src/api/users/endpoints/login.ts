import { generateToken } from "./../functions/generateJwt";
import { compareHashedPasswordAsync } from "./../functions/passwords";
/* eslint-disable consistent-return */
import express, { Router, Request, Response } from "express";
import User, { UserAttributesInterface } from "../../../models/users/User";

const router: Router = express.Router();

const login = router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!password) throw new Error("Field 'password' required");
    if (!email) throw new Error("Field 'email' is required.");

    const user: UserAttributesInterface = (await User.findOne({
      where: {
        email,
      },
      attributes: ["password", "id"],
    })) as unknown as UserAttributesInterface;

    if (!user) return res.status(400).json({ message: "User not found" });

    const passwordsMatch = await compareHashedPasswordAsync({
      textPassword: password,
      hash: user.password,
    });

    if (!passwordsMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = await generateToken({ email: user.email, userId: user.id });

    res.send({
      status: "ok",
      msg: "Logged in successfully",
      user: {
        userId: user.id,
      },
      token,
    });
  } catch (e) {
    res.status(500).json({ e });
    console.log(e);
  }
});

export default login;
