import { AuthOptional } from "./../../../middleware/AuthOptional";
import { CommentVoteAttributesInterface } from "./../../../models/posts/CommentVote";
import { CommentAttributesInterface } from "./../../../models/posts/Comment";
import { Auth, IUserRequest } from "../../../middleware/Auth";
import express, { Router, Response } from "express";
import Post from "../../../models/posts/Post";
import catchAsync from "../../../middleware/catchAsync";
import Comment from "../../../models/posts/Comment";
import CommentVote from "../../../models/posts/CommentVote";

const router: Router = express.Router();

const getComments = router.post(
  "/get_comments",
  AuthOptional,
  catchAsync(async (req: IUserRequest, res: Response) => {
    const { postId } = req.body;

    if (!postId)
      return res.status(400).send({
        status: "err",
        message: "Field 'postId' is required",
      });

    const comments: CommentAttributesInterface[] = (await Comment.findAll({
      where: {
        postId,
      },
      include: [
        {
          model: CommentVote,
          as: "commentVotes",
        },
      ],
      order: [["createdAt", "ASC"]],
    })) as unknown as CommentAttributesInterface[];

    const formattedComments: any = [];

    comments.forEach((comment: CommentAttributesInterface, index: number) => {
      if (!comment.commentVotes) return;

      let upVotes = 0;
      let downVotes = 0;
      let upVoted = false;
      let downVoted = false;

      comment.commentVotes.forEach((vote: CommentVoteAttributesInterface) => {
        if (vote.upvote) {
          upVotes = upVotes + 1;

          if (vote.userId === req.user?.userId) {
            upVoted = true;
          }
        } else if (vote.downvote) {
          downVotes = downVotes + 1;

          if (vote.userId === req.user?.userId) {
            downVoted = true;
          }
        }
      });

      formattedComments.push({
        upVotes,
        downVotes,
        downVoted,
        upVoted,
        voteScore: upVotes - downVotes,
        comment,
      });
    });

    res.json({
      status: "ok",
      comments: formattedComments,
    });
  })
);

export default getComments;
