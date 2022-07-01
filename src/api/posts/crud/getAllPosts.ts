import { PostAttributesInterface } from "./../../../models/posts/Post";
import { Auth, IUserRequest } from "../../../middleware/Auth";
import express, { Router, Response, raw } from "express";
import catchAsync from "../../../middleware/catchAsync";
import Post from "../../../models/posts/Post";
import PostVote from "../../../models/posts/PostVote";
import db from "../../../db/db";
import { parse } from "path";

const router: Router = express.Router();

const getAllPosts = router.get(
  "/get_all",
  catchAsync(async (req: IUserRequest, res: Response) => {
    const posts: PostAttributesInterface[] = (await Post.findAll({
      // @ts-ignore
      include: [
        {
          model: PostVote,
          required: false,
          as: "votes",
        },
      ],
    })) as unknown as PostAttributesInterface[];

    const parsedPosts: any = [];

    await posts.forEach((post: any, index) => {
      let upvotes = 0;
      let downvotes = 0;

      post.votes.forEach((vote: any) => {
        if (vote.upvote) {
          upvotes++;
        } else if (vote.downvote) {
          downvotes++;
        }
      });

      parsedPosts.push({
        voteScore: upvotes - downvotes,
        upvotes,
        downvotes,
        upvoted: post.votes.some(
          (vote: any) =>
            vote.userId === req.user?.userId && vote.upvote === true
        ),
        downvoted: post.votes.some(
          (vote: any) =>
            vote.userId === req.user?.userId && vote.downvote === true
        ),
        post: post.dataValues,
      });
    });

    res.json({ posts: parsedPosts });
  })
);

export default getAllPosts;
