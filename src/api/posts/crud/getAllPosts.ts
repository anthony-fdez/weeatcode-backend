import { AuthOptional } from "./../../../middleware/AuthOptional";
import { PostAttributesInterface } from "./../../../models/posts/Post";
import { Auth, IUserRequest } from "../../../middleware/Auth";
import express, { Router, Response, raw } from "express";
import catchAsync from "../../../middleware/catchAsync";
import Post from "../../../models/posts/Post";
import PostVote, {
  PostVoteAttributesInterface,
} from "../../../models/posts/PostVote";
import db from "../../../db/db";
import { parse } from "path";
import { ok } from "assert";

const router: Router = express.Router();

const getAllPosts = router.get(
  "/get_all",
  AuthOptional,
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
      let upVotes = 0;
      let upVoted = false;

      let downVotes = 0;
      let downVoted = false;

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

      parsedPosts.push({
        voteScore: upVotes - downVotes,
        upVotes,
        downVotes,
        upVoted,
        downVoted,
        post: post.dataValues,
      });
    });

    res.json({ status: "ok", posts: parsedPosts });
  })
);

export default getAllPosts;
