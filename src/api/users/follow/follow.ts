import { FollowAttributesInterface } from "./../../../models/users/Follow";
import { Auth } from "./../../../middleware/Auth";
/* eslint-disable consistent-return */
import express, { NextFunction, Request, Response, Router } from "express";
import catchAsync from "../../../middleware/catchAsync";
import Follow from "../../../models/users/Follow";
import User from "../../../models/users/User";
import { IUserRequest } from "../../../middleware/AuthOptional";

const router: Router = express.Router();

const follow = router.post(
  "/follow",
  Auth,
  catchAsync(async (req: IUserRequest, res: Response, next: NextFunction) => {
    const { userId, userName, followingUserName } = req.body;

    if (!userId)
      return res.status(400).send({
        status: "err",
        message: "Field 'userId' is required",
      });

    if (!userName)
      return res.status(400).send({
        status: "err",
        message: "Field 'userName' is required",
      });

    if (!followingUserName)
      return res.status(400).send({
        status: "err",
        message: "Field 'followingUserName' is required",
      });

    if (userId === req.user?.userId) {
      return res.status(400).send({
        status: "err",
        message: "You cant follow yourself",
      });
    }

    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!user)
      return res.status(400).json({
        status: "err",
        message: "User not found",
      });

    const followRecord: FollowAttributesInterface = (await Follow.findOne({
      where: {
        userId: req.user?.userId,
        followingUserId: userId,
      },
    })) as unknown as FollowAttributesInterface;

    if (!followRecord) {
      if (!req.user?.userId) throw new Error("User id undefined");

      await Follow.create({
        userId: req.user?.userId,
        userName,
        followingUserId: userId,
        followingUserName,
      });

      return res.send({ status: "ok", message: "User followed" });
    } else {
      await Follow.destroy({
        where: {
          userId: req.user?.userId,
          followingUserId: userId,
        },
      });

      return res.send({ status: "ok", message: "User unfollowed" });
    }
  })
);

export default follow;
