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
  Auth,
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
    })) as unknown as CommentAttributesInterface[];

    const formattedComments: any = [];

    comments.forEach((comment: CommentAttributesInterface, index: number) => {
      if (!comment.commentVotes) return;

      let upvotes = 0;
      let downvotes = 0;

      comment.commentVotes.forEach((vote: CommentVoteAttributesInterface) => {
        if (vote.upvote) {
          upvotes = upvotes + 1;
        } else if (vote.downvote) {
          downvotes = downvotes - 1;
        }
      });

      formattedComments.push({
        upvotes,
        downvotes,
        voteScore: upvotes - downvotes,
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
