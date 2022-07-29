/* eslint-disable consistent-return */
import express, { NextFunction, Request, Response, Router } from "express";
import catchAsync from "../../../middleware/catchAsync";

const router: Router = express.Router();

const getFollowers = router.post(
  "/get_followers",
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.send("ok");
  })
);

export default getFollowers;
