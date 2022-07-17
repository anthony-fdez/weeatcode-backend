import { AuthOptional } from "./../../../middleware/AuthOptional";
import express, { Response, Router } from "express";
import { Auth, IUserRequest } from "../../../middleware/Auth";
import catchAsync from "../../../middleware/catchAsync";

const router: Router = express.Router();

const addView = router.post(
  "/create",
  AuthOptional,
  catchAsync(async (req: IUserRequest, res: Response) => {
    const { postId } = req.body;

    if (!req.user?.userId || !req.user?.userName)
      return res.status(400).send({ status: "err", message: "Please log in" });

    res.json({
      status: "ok",
      message: "View added",
    });
  })
);

export default addView;
