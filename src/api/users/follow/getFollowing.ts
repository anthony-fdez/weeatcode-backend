import Follow, {
  FollowAttributesInterface,
} from "./../../../models/users/Follow";
import { AuthOptional } from "./../../../middleware/AuthOptional";
/* eslint-disable consistent-return */
import express, { NextFunction, Request, Response, Router } from "express";
import catchAsync from "../../../middleware/catchAsync";
import { IUserRequest } from "../../../middleware/Auth";
import { Op } from "sequelize";

const router: Router = express.Router();

const getFollowing = router.post(
  "/get_following",
  AuthOptional,
  catchAsync(async (req: IUserRequest, res: Response, next: NextFunction) => {
    const { userId } = req.body;

    if (!userId)
      return res.status(400).send({
        status: "err",
        message: "Field 'userId' is required.",
      });

    const followingUsers: FollowAttributesInterface[] = (await Follow.findAll({
      where: {
        [Op.or]: {
          userId: [userId, req.user?.userId],
        },
      },
    })) as unknown as FollowAttributesInterface[];

    const formattedFollowing: any = [];

    await followingUsers.forEach((user, index) => {
      let following = false;

      followingUsers.some((me) => {
        if (req.user?.userId === me.userId) {
          if (me.followingUserId === user.followingUserId) {
            return (following = true);
          }
        }
      });

      if (user.userId === userId) {
        formattedFollowing.push({
          following,
          user,
        });
      }
    });

    res.send({ status: "ok", following: formattedFollowing });
  })
);

export default getFollowing;
