import { Auth, IUserRequest } from "./../../../middleware/Auth";
import express, { Router, Response } from "express";
import Token from "../../../models/users/Token";
import catchAsync from "../../../middleware/catchAsync";

const router: Router = express.Router();

const logoutAll = router.post(
  "/logout_all",
  Auth,
  catchAsync(async (req: IUserRequest, res: Response) => {
    await Token.destroy({
      where: {
        userId: req.user?.userId,
      },
    });

    res.send({
      status: "ok",
      message: "Logged out all sessions",
    });
  })
);
export default logoutAll;
