import { generateToken } from "./../functions/generateJwt";
import express, { Router, Request, Response, NextFunction } from "express";
import User, { UserAttributesInterface } from "../../../models/users/User";
import catchAsync from "../../../middleware/catchAsync";
import validator from "validator";
import { ErrorHandler } from "../../../utils/error/errorHandling";

const router: Router = express.Router();

const signup = router.post("/signup",  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

    if (!email || !name || !password) return next(new ErrorHandler("'email', 'name' and 'password' fields are required", 400));

    // This will verify the email is valid
    if (!validator.isEmail(email)) throw new ErrorHandler("Invalid 'email' recieved", 400);

    const user: UserAttributesInterface = (await User.create({
      name,
      email,
      password,
    })) as unknown as UserAttributesInterface;

    const token = await generateToken({ email: user.email, userId: user.id });

    res.send({
      status: "ok",
      msg: "User Created",
      user: {
        userId: user.id,
      },
      token,
    });
}));

export default signup;
