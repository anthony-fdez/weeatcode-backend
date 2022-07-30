import Follow, {
  FollowAttributesInterface,
} from "./../../../models/users/Follow";
import { AuthOptional } from "./../../../middleware/AuthOptional";
/* eslint-disable consistent-return */
import express, { NextFunction, Request, Response, Router } from "express";
import catchAsync from "../../../middleware/catchAsync";
import { IUserRequest } from "../../../middleware/Auth";

const router: Router = express.Router();

const getFollowers = router.post(
  "/get_followers",
  AuthOptional,
  catchAsync(async (req: IUserRequest, res: Response, next: NextFunction) => {
    const { userId } = req.body;

    if (!userId)
      return res.status(400).send({
        status: "err",
        message: "Field 'userId' is required.",
      });

    const followers: FollowAttributesInterface[] = (await Follow.findAll({
      where: {
        followingUserId: userId,
      },
    })) as unknown as FollowAttributesInterface[];

    const formattedFollowers: any = [];

    await followers.forEach((follower, index) => {
      let following = false;

      if (req.user?.userId === follower.userId) {
        following = true;
      }

      formattedFollowers.push({
        following,
        follower,
      });
    });

    res.send({ status: "ok", followers: formattedFollowers });
  })
);

export default getFollowers;
