import { Auth, IUserRequest } from "./../../../middleware/Auth";
import express, { Router, Request, Response } from "express";
import Token from "../../../models/users/Token";
import catchAsync from "../../../middleware/catchAsync";

const router: Router = express.Router();

const logout = router.post(
  "/logout",
  Auth,
  catchAsync(async (req: IUserRequest, res: Response) => {
    await Token.destroy({ where: { token: req.user?.token } });

    res.send({
      status: "ok",
      message: "Logged out successfully",
    });
  })
);
export default logout;
