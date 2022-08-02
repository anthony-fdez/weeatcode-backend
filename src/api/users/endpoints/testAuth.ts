import { Auth, IUserRequest } from "./../../../middleware/Auth";
import express, { Router, Request, Response } from "express";
import catchAsync from "../../../middleware/catchAsync";

const router: Router = express.Router();

const testAuth = router.post(
  "/test-auth",
  Auth,
  catchAsync(async (req: IUserRequest, res: Response) => {
    res.send({
      status: "ok",
      message: "Logged in",
    });
  })
);
export default testAuth;
