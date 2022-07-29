/* eslint-disable consistent-return */
import express, { NextFunction, Request, Response, Router } from "express";
import catchAsync from "../../../middleware/catchAsync";

const router: Router = express.Router();

const follow = router.post(
  "/follow",
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.send("ok");
  })
);

export default follow;
