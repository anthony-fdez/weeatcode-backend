import { CommentAttributesInterface } from "./../../../models/posts/Comment";
import { Auth, IUserRequest } from "../../../middleware/Auth";
import express, { Router, Response } from "express";
import Post from "../../../models/posts/Post";
import catchAsync from "../../../middleware/catchAsync";
import Comment from "../../../models/posts/Comment";

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

    const comments = await Comment.findAll({
      where: {
        postId,
      },
    });

    res.json({
      status: "ok",
      comments,
    });
  })
);

export default getComments;
