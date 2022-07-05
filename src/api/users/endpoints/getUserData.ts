import { PostVoteAttributesInterface } from "./../../../models/posts/PostVote";
import { UserAttributesInterface } from "./../../../models/users/User";
import { AuthOptional } from "./../../../middleware/AuthOptional";
import { IUserRequest } from "./../../../middleware/Auth";
import express, { Router, Request, Response } from "express";
import Token from "../../../models/users/Token";
import catchAsync from "../../../middleware/catchAsync";
import User from "../../../models/users/User";
import Post from "../../../models/posts/Post";
import PostVote from "../../../models/posts/PostVote";

const router: Router = express.Router();

const getUserData = router.post(
  "/user_data",
  AuthOptional,
  catchAsync(async (req: IUserRequest, res: Response) => {
    const { userId } = req.body;

    if (!userId)
      return res.status(400).send({
        status: "err",
        message: "Field `userId` is required",
      });

    const user: UserAttributesInterface = (await User.findOne({
      where: {
        id: userId,
      },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Post,
          required: false,
          as: "posts",
          include: [
            {
              model: PostVote,
              as: "votes",
            },
          ],
        },
      ],
    })) as unknown as UserAttributesInterface;

    const posts: any = [];

    // @ts-ignore
    user.posts.forEach((post: PostAttributesInterface) => {
      let upvotes = 0;
      let downvotes = 0;

      post.votes.forEach((vote: PostVoteAttributesInterface) => {
        if (vote.upvote) {
          upvotes = upvotes + 1;
        } else if (vote.downvote) {
          downvotes = downvotes + 1;
        }
      });

      posts.push({
        upvotes,
        downvotes,
        voteScore: upvotes - downvotes,
        upvoted: post.votes.some(
          (vote: any) =>
            vote.userId === req.user?.userId && vote.upvote === true
        ),
        downvoted: post.votes.some(
          (vote: any) =>
            vote.userId === req.user?.userId && vote.downvote === true
        ),
        post,
      });
    });

    res.send({
      status: "ok",
      data: {
        totalPosts: posts.length,
        user,
        posts: posts,
      },
    });
  })
);
export default getUserData;
