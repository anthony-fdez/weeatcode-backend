import { AuthOptional } from "./../../../middleware/AuthOptional";
import { PostVoteAttributesInterface } from "./../../../models/posts/PostVote";
import { PostAttributesInterface } from "./../../../models/posts/Post";
import { Auth, IUserRequest } from "../../../middleware/Auth";
import express, { Router, Response, raw } from "express";
import catchAsync from "../../../middleware/catchAsync";
import Post from "../../../models/posts/Post";
import PostVote from "../../../models/posts/PostVote";
import db from "../../../db/db";
import View from "../../../models/posts/View";

const router: Router = express.Router();

const getById = router.post(
  "/get_by_id",
  AuthOptional,
  catchAsync(async (req: IUserRequest, res: Response) => {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({
        status: "err",
        message: "Parameter 'postId' is required",
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
        {
          model: View,
          as: "views",
        },
      ],
    })) as unknown as PostAttributesInterface;

    if (!post) {
      res.status(400).json({
        status: "err",
        message: `Post with id '${postId}' not found`,
      });
    }

    let upVotes = 0;
    let downVotes = 0;

    let upVoted = false;
    let downVoted = false;

    // @ts-ignore
    let views = post.views.length;

    if (post.votes) {
      post.votes.forEach((vote: PostVoteAttributesInterface, index) => {
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
    }

    res.json({
      status: "ok",
      upVotes,
      downVotes,
      voteScore: upVotes - downVotes,
      upVoted,
      downVoted,
      views,
      post,
      votes: post.votes,
    });
  })
);

export default getById;
