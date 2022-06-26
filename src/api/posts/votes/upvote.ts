import { PostVoteAttributesInterface } from "./../../../models/posts/PostVote";
import { Auth, IUserRequest } from "../../../middleware/Auth";
import express, { Router, Response } from "express";
import PostVote from "../../../models/posts/PostVote";
import Post from "../../../models/posts/Post";

const router: Router = express.Router();

const postUpvote = router.post(
  "/upvote",
  Auth,
  async (req: IUserRequest, res: Response) => {
    try {
      const { postId } = req.body;

      if (!postId) {
        return res.status(400).send({
          status: "err",
          msg: "Field 'postId' is required",
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
          msg: `Post with id '${postId}' does not exist`,
        });
      }

      const postVoteRecord = (await PostVote.findOne({
        where: {
          postId: postId,
          userId: req.user?.userId,
        },
      })) as unknown as PostVoteAttributesInterface;

      if (!postVoteRecord) {
        // If it doesnt exist create one

        if (!req.user?.userId) throw new Error("User id undefined");

        await PostVote.create({
          userId: req.user?.userId,
          postId,
          upvote: true,
          downvote: false,
        });

        return res.send({ status: "ok", msg: "Post upvoted" });
      } else if (postVoteRecord.upvote) {
        // remove the upvote

        await PostVote.update(
          {
            upvote: false,
            downvote: false,
          },
          {
            where: {
              id: postId,
              userId: req.user?.userId,
            },
          }
        );

        return res.send({ status: "ok", msg: "Post upvote removed" });
      } else {
        // add the upvote

        await PostVote.update(
          {
            upvote: true,
            downvote: false,
          },
          {
            where: {
              id: postId,
              userId: req.user?.userId,
            },
          }
        );

        return res.send({ status: "ok", msg: "Post upvoted" });
      }
    } catch (err) {
      res.status(500).send({ err, status: "err" });

      console.log(err);
    }
  }
);

export default postUpvote;
