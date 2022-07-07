import { CommentAttributesInterface } from "./../../../models/posts/Comment";
import { Auth, IUserRequest } from "../../../middleware/Auth";
import express, { Router, Response } from "express";
import Post from "../../../models/posts/Post";
import catchAsync from "../../../middleware/catchAsync";
import Comment from "../../../models/posts/Comment";

const router: Router = express.Router();

const editComment = router.post(
  "/edit",
  Auth,
  catchAsync(async (req: IUserRequest, res: Response) => {
    const { commentId, newComment } = req.body;

    if (!req.user?.userId || !req.user?.userName)
      return res.status(400).send({ status: "err", message: "Please log in" });

    if (!commentId || !newComment) {
      return res.status(400).send({
        status: "err",
        message: "Missing parameters. 'commentId', 'newComment' are required",
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

    if (comment.deleted)
      return res
        .status(400)
        .send({ status: "err", message: "This comment was deleted" });

    let updatedComment: CommentAttributesInterface;

    if (comment.userId === req.user.userId) {
      updatedComment = (await Comment.update(
        {
          comment: newComment,
          edited: true,
        },
        {
          where: {
            id: commentId,
          },
          returning: true,
        }
      )) as unknown as CommentAttributesInterface;
    } else {
      return res.status(401).send({
        status: "err",
        message: "Unauthorized to edit this comment",
      });
    }

    res.json({
      status: "ok",
      message: "Comment edited",
      updatedComment,
    });
  })
);

export default editComment;
