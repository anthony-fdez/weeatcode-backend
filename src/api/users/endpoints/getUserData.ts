import { PostVoteAttributesInterface } from "./../../../models/posts/PostVote";
import { UserAttributesInterface } from "./../../../models/users/User";
import { AuthOptional } from "./../../../middleware/AuthOptional";
import { IUserRequest } from "./../../../middleware/Auth";
import express, { Router, Request, Response } from "express";
import Token from "../../../models/users/Token";
import catchAsync from "../../../middleware/catchAsync";
import User from "../../../models/users/User";
import Post, { PostAttributesInterface } from "../../../models/posts/Post";
import PostVote from "../../../models/posts/PostVote";
import Follow from "../../../models/users/Follow";

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
          as: "posts",
          include: [
            {
              model: PostVote,
              as: "votes",
            },
          ],
        },
        {
          model: Follow,
          as: "followers",
          required: false,
        },
        {
          model: Follow,
          as: "following",
          required: false,
        },
      ],
    })) as unknown as UserAttributesInterface;

    if (!user)
      return res.status(401).send({
        status: "err",
        message: "User not found",
      });

    const posts: any = [];
    let following: boolean = false;

    if (user.posts) {
      user.posts.forEach((post: PostAttributesInterface) => {
        if (!post.id) return;

        let upVotes = 0;
        let upVoted = false;

        let downVotes = 0;
        let downVoted = false;

        if (post.votes) {
          post.votes.forEach((vote: PostVoteAttributesInterface) => {
            if (vote.upvote) {
              upVotes++;

              if (vote.userId === req.user?.userId) {
                upVoted = true;
              }
            } else if (vote.downvote) {
              downVotes++;

              if (vote.userId === req.user?.userId) {
                downVoted = true;
              }
            }
          });

          posts.push({
            upVotes,
            downVotes,
            voteScore: upVotes - downVotes,
            upVoted,
            downVoted,
            post,
          });
        }
      });
    }

    let followers = 0;

    if (user.followers) {
      user.followers.forEach((follow) => {
        if (follow.userId === req.user?.userId) {
          following = true;
        }
      });

      if (user.followers[0].id) {
        followers = user.followers.length;
      }
    }

    res.send({
      status: "ok",
      data: {
        totalPosts: posts.length,
        following,
        user,
        followers,
        posts: posts,
      },
    });
  })
);
export default getUserData;
