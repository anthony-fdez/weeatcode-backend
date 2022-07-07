import { CommentAttributesInterface } from "./../../../models/posts/Comment";
import { Auth, IUserRequest } from "../../../middleware/Auth";
import express, { Router, Response } from "express";
import Post from "../../../models/posts/Post";
import catchAsync from "../../../middleware/catchAsync";
import Comment from "../../../models/posts/Comment";

const router: Router = express.Router();

const createComment = router.post(
  "/create",
  Auth,
  catchAsync(async (req: IUserRequest, res: Response) => {
    const {
      postId,
      replyCommentId,
      replyUserName,
      replyUserId,
      createdByTest,
      comment,
    } = req.body;

    if (!req.user?.userId || !req.user?.userName)
      return res.status(400).send({ status: "err", message: "Please log in" });

    if (!postId || !comment) {
      return res.status(400).send({
        status: "err",
        message: "Missing parameters. 'postId' and 'comment' are required",
      });
    }

    let newComment: CommentAttributesInterface;

    if (replyCommentId && replyUserName && replyUserId) {
      newComment = (await Comment.create({
        userId: req.user?.userId,
        userName: req.user?.userName,
        postId: postId,
        comment,
        replyCommentId,
        replyUserName,
        createdByTest: createdByTest || false,
        replyUserId,
      })) as unknown as CommentAttributesInterface;
    } else {
      newComment = (await Comment.create({
        userId: req.user?.userId,
        userName: req.user?.userName,
        postId: postId,
        comment,
        createdByTest: createdByTest || false,
      })) as unknown as CommentAttributesInterface;
    }

    res.json({
      status: "ok",
      message: "Comment created",
      comment: newComment,
    });
  })
);

export default createComment;
