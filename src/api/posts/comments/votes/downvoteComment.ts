import CommentVote, {
  CommentVoteAttributesInterface,
} from "./../../../../models/posts/CommentVote";
import { PostVoteAttributesInterface } from "./../../../../models/posts/PostVote";
import { Auth, IUserRequest } from "../../../../middleware/Auth";
import express, { Router, Response } from "express";
import Post from "../../../../models/posts/Post";
import PostVote from "../../../../models/posts/PostVote";
import catchAsync from "../../../../middleware/catchAsync";
import Comment, {
  CommentAttributesInterface,
} from "../../../../models/posts/Comment";

const router: Router = express.Router();

const commentDownvote = router.post(
  "/downvote",
  Auth,
  catchAsync(async (req: IUserRequest, res: Response) => {
    const { commentId } = req.body;

    if (!commentId) {
      return res.status(400).send({
        status: "err",
        message: "Field 'commentId' is required",
      });
    }

    const commentExists: CommentAttributesInterface = (await Comment.findOne({
      where: {
        id: commentId,
      },
    })) as unknown as CommentAttributesInterface;

    if (!commentExists) {
      return res.status(400).send({
        status: "err",
        message: `Comment with id '${commentId}' does not exist`,
      });
    }

    console.log(commentExists);

    const commentVoteRecord = (await CommentVote.findOne({
      where: {
        commentId,
        userId: req.user?.userId,
      },
    })) as unknown as CommentVoteAttributesInterface;

    if (!commentVoteRecord) {
      // If it doesnt exist create one

      if (!req.user?.userId) throw new Error("User id undefined");

      await CommentVote.create({
        userId: req.user?.userId,
        userName: req.user?.userName,
        postId: commentExists.postId,
        upvote: false,
        downvote: true,
        commentId,
      });

      return res.send({ status: "ok", message: "Comment downvoted" });
    } else if (commentVoteRecord.downvote) {
      // remove the upvote

      await CommentVote.update(
        {
          upvote: false,
          downvote: false,
        },
        {
          where: {
            postId: commentExists.postId,
            userId: req.user?.userId,
            commentId,
          },
        }
      );

      return res.send({ status: "ok", message: "Comment downvote removed" });
    } else {
      // add the upvote

      await CommentVote.update(
        {
          upvote: false,
          downvote: true,
        },
        {
          where: {
            postId: commentExists.postId,
            userId: req.user?.userId,
            commentId,
          },
        }
      );

      return res.send({ status: "ok", message: "Comment downvoted" });
    }
  })
);

export default commentDownvote;
