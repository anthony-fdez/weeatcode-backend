import { PostVoteAttributesInterface } from "./../../../models/posts/PostVote";
import { Auth, IUserRequest } from "../../../middleware/Auth";
import express, { Router, Response } from "express";
import Post from "../../../models/posts/Post";
import PostVote from "../../../models/posts/PostVote";
import catchAsync from "../../../middleware/catchAsync";

const router: Router = express.Router();

const postDownvote = router.post(
  "/downvote",
  Auth,
  catchAsync(async (req: IUserRequest, res: Response) => {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).send({
        status: "err",
        message: "Field 'postId' is required",
      });
    }

    const postExists = await Post.findOne({
      where: {
        id: postId,
      },
    });

    if (!postExists) {
      return res.status(400).send({
        status: "err",
        message: `Post with id '${postId}' does not exist`,
      });
    }

    const postVoteRecord = (await PostVote.findOne({
      where: {
        postId: postId,
        userId: req.user?.userId,
      },
    })) as unknown as PostVoteAttributesInterface;

    if (!postVoteRecord) {
      // If it doesn't exist create one

      if (!req.user?.userId) throw new Error("User id undefined");

      await PostVote.create({
        userId: req.user?.userId,
        userName: req.user?.userName,
        postId,
        upvote: false,
        downvote: true,
      });

      return res.send({ status: "ok", message: "Post downVoted" });
    } else if (postVoteRecord.downvote) {
      // remove the upvote

      await PostVote.update(
        {
          upvote: false,
          downvote: false,
        },
        {
          where: {
            postId: postId,
            userId: req.user?.userId,
          },
        }
      );

      return res.send({ status: "ok", message: "Post downvote removed" });
    } else {
      // add the upvote

      await PostVote.update(
        {
          upvote: false,
          downvote: true,
        },
        {
          where: {
            postId: postId,
            userId: req.user?.userId,
          },
        }
      );

      return res.send({ status: "ok", message: "Post downVoted" });
    }
  })
);

export default postDownvote;
