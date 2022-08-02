import { FollowAttributesInterface } from "./../../../models/users/Follow";
import User, { UserAttributesInterface } from "./../../../models/users/User";
import { PostVoteAttributesInterface } from "./../../../models/posts/PostVote";
import { PostAttributesInterface } from "./../../../models/posts/Post";
import { AuthOptional } from "./../../../middleware/AuthOptional";
import { Auth, IUserRequest } from "../../../middleware/Auth";
import express, { Router, Response } from "express";
import Post from "../../../models/posts/Post";

import { Op } from "sequelize";
import catchAsync from "../../../middleware/catchAsync";
import PostVote from "../../../models/posts/PostVote";
import View from "../../../models/posts/View";
import Follow from "../../../models/users/Follow";

const router: Router = express.Router();

const searchPosts = router.post(
  "/search",
  AuthOptional,
  catchAsync(async (req: IUserRequest, res: Response) => {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        status: "error",
        message: "Field 'text' is required",
      });
    }

    const posts: PostAttributesInterface[] = (await Post.findAll({
      where: {
        [Op.or]: [
          {
            body: {
              [Op.iLike]: `%${text}%`,
            },
          },
          {
            title: {
              [Op.iLike]: `%${text}%`,
            },
          },
          {
            authorName: {
              [Op.iLike]: `%${text}%`,
            },
          },
        ],
      },
      include: [
        {
          model: PostVote,
          required: false,
          as: "votes",
        },
        {
          model: View,
          as: "views",
        },
      ],
    })) as unknown as PostAttributesInterface[];

    const parsedPosts: any = [];

    await posts.forEach((post: any, index) => {
      let upVotes = 0;
      let upVoted = false;

      let downVotes = 0;
      let downVoted = false;

      const views = post.views.length;

      post.votes.forEach((vote: PostVoteAttributesInterface) => {
        if (!req.user?.userId) return;

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

      parsedPosts.push({
        voteScore: upVotes - downVotes,
        upVotes,
        downVotes,
        upVoted,
        downVoted,
        views,
        post: post.dataValues,
      });
    });

    const users: UserAttributesInterface[] = (await User.findAll({
      where: {
        name: {
          [Op.iLike]: `%${text}%`,
        },
      },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Follow,
          as: "followers",
          required: false,
        },
      ],
    })) as unknown as UserAttributesInterface[];

    const formattedUsers: any = [];

    users.forEach((user: any) => {
      let following = false;

      user.followers.forEach((follower: FollowAttributesInterface) => {
        console.log(follower);
        if (follower.userId === req.user?.userId) {
          following = true;
        }
      });

      formattedUsers.push({
        following,
        user,
      });
    });

    res.send({ status: "ok", posts: parsedPosts, users: formattedUsers });
  })
);

export default searchPosts;
