import { PostVoteAttributesInterface } from "./../../../models/posts/PostVote";
import { PostAttributesInterface } from "./../../../models/posts/Post";
import { Auth, IUserRequest } from "../../../middleware/Auth";
import express, { Router, Response, raw } from "express";
import catchAsync from "../../../middleware/catchAsync";
import Post from "../../../models/posts/Post";
import PostVote from "../../../models/posts/PostVote";
import db from "../../../db/db";

const router: Router = express.Router();

const getById = router.post(
  "/get_by_id",
  catchAsync(async (req: IUserRequest, res: Response) => {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({
        status: "err",
        msg: "Parameter 'postId' is required",
      });
    }

    const post: PostAttributesInterface = (await Post.findOne({
      where: {
        id: postId,
      },
      include: [
        {
          model: PostVote,
          as: "votes",
        },
      ],
    })) as unknown as PostAttributesInterface;

    if (!post) {
      res.status(400).json({
        status: "err",
        msg: `Post with id '${postId}' not found`,
      });
    }

    let voteScore = 0;
    let upvotes = 0;
    let downvotes = 0;

    let upvoted = false;
    let downvoted = false;

    if (post.votes) {
      post.votes.forEach((vote: PostVoteAttributesInterface, index) => {
        if (vote.upvote) {
          upvotes++;

          if (vote.userId === req.user?.userId) {
            upvoted = true;
          }
        } else if (vote.downvote) {
          downvotes++;

          if (vote.userId === req.user?.userId) {
            downvoted = true;
          }
        }
      });
    }

    res.json({
      status: "ok",
      upvotes,
      downvotes,
      voteScore: upvotes - downvotes,
      upvoted,
      downvoted,
      post,
      votes: post.votes,
    });
  })
);

export default getById;
