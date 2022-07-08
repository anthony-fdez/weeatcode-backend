import { CommentAttributesInterface } from "./../../../models/posts/Comment";
import { Auth, IUserRequest } from "../../../middleware/Auth";
import express, { Router, Response } from "express";
import Post from "../../../models/posts/Post";
import catchAsync from "../../../middleware/catchAsync";
import Comment from "../../../models/posts/Comment";

const router: Router = express.Router();

const deleteComment = router.post(
  "/delete",
  Auth,
  catchAsync(async (req: IUserRequest, res: Response) => {
    const { commentId } = req.body;

    if (!req.user?.userId || !req.user?.userName)
      return res.status(400).send({ status: "err", message: "Please log in" });

    if (!commentId) {
      return res.status(400).send({
        status: "err",
        message: "Missing parameters. 'commentId' is required",
      });
    }

    const comment: CommentAttributesInterface = (await Comment.findOne({
      where: {
        id: commentId,
      },
    })) as unknown as CommentAttributesInterface;

    if (!comment)
      return res.status(400).send({
        status: "err",
        message: "Comment does not exist",
      });

    if (comment.userId === req.user.userId) {
      // We are not actually going to delete the records, cause we don't want do delete replies if
      // someone deletes their comment, so we only change the comment to [deleted]

      (await Comment.update(
        {
          comment: "[deleted]",
          deleted: true,
        },
        {
          where: {
            id: commentId,
          },
        }
      )) as unknown as CommentAttributesInterface;
    } else {
      return res.status(401).send({
        status: "err",
        message: "Unauthorized to delete this comment",
      });
    }

    res.json({
      status: "ok",
      message: "Comment deleted",
    });
  })
);

export default deleteComment;
