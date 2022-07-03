import { generateToken } from "./../functions/generateJwt";
import { compareHashedPasswordAsync } from "./../functions/passwords";
/* eslint-disable consistent-return */
import express, { Router, Request, Response, NextFunction } from "express";
import User, { UserAttributesInterface } from "../../../models/users/User";
import catchAsync from "../../../middleware/catchAsync";
import { ErrorHandler } from "../../../utils/error/errorHandling";

const router: Router = express.Router();

const login = router.post(
  "/login",
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!password) {
      return next(new ErrorHandler("Field 'password' required", 400));
    }

    if (!email) {
      return next(new ErrorHandler("Field 'email' required", 400));
    }

    const user: UserAttributesInterface = (await User.findOne({
      where: {
        email,
      },
      attributes: ["password", "id", "name"],
    })) as unknown as UserAttributesInterface;

    if (!user) return next(new ErrorHandler("User not found", 400));

    const passwordsMatch = await compareHashedPasswordAsync({
      textPassword: password,
      hash: user.password,
    });

    if (!passwordsMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = await generateToken({ email: user.email, userId: user.id });

    res.send({
      status: "ok",
      message: "Logged in successfully",
      user: {
        userId: user.id,
        name: user.name,
      },
      token,
    });
  })
);

export default login;
