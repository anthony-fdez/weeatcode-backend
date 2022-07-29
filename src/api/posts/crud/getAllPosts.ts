import { paginateArray } from "./../../../utils/paginateArray";
import { parse } from "path";
import { AuthOptional } from "./../../../middleware/AuthOptional";
import { PostAttributesInterface } from "./../../../models/posts/Post";
import { Auth, IUserRequest } from "../../../middleware/Auth";
import express, { Router, Response, raw } from "express";
import catchAsync from "../../../middleware/catchAsync";
import Post from "../../../models/posts/Post";
import PostVote, {
  PostVoteAttributesInterface,
} from "../../../models/posts/PostVote";
import View from "../../../models/posts/View";

const router: Router = express.Router();

const getAllPosts = router.get(
  "/get_all",
  AuthOptional,
  catchAsync(async (req: IUserRequest, res: Response) => {
    if (!req.query.page)
      return res.status(400).send({
        status: "error",
        message: "Please specify the page.",
      });

    // @ts-ignore
    const page = parseInt(req.query.page);
    const startIndex = (page - 1) * 10;
    const endIndex = page * 10;

    if (page <= 0) {
      return res.status(400).send({
        status: "error",
        message: "Page should be greater than 0.",
      });
    }

    const posts: PostAttributesInterface[] = (await Post.findAll({
      // @ts-ignore
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

    res.json({
      status: "ok",
      posts: paginateArray({ array: parsedPosts, startIndex, endIndex }),
    });
  })
);

export default getAllPosts;
