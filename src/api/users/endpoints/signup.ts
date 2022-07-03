import { generateToken } from "./../functions/generateJwt";
import express, { Router, Request, Response, NextFunction } from "express";
import User, { UserAttributesInterface } from "../../../models/users/User";
import validator from "validator";
import { ErrorHandler } from "../../../utils/error/errorHandling";
import catchAsync from "../../../middleware/catchAsync";

const router: Router = express.Router();

const signup = router.post(
  "/signup",
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, createdByTest } = req.body;

    if (!email || !name || !password)
      return next(
        new ErrorHandler(
          "'email', 'name' and 'password' fields are required",
          400
        )
      );

    // This will verify the email is valid
    if (!validator.isEmail(email)) {
      return next(new ErrorHandler("Invalid 'email' recieved", 400));
    }

    const user: UserAttributesInterface = (await User.create({
      name,
      email,
      password,
      createdByTest: createdByTest || false,
    })) as unknown as UserAttributesInterface;

    const token = await generateToken({ email: user.email, userId: user.id });

    res.send({
      status: "ok",
      message: "User Created",
      user: {
        userId: user.id,
        name: user.name,
      },
      token,
    });
  })
);
export default signup;
