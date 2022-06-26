import { PostAttributesInterface } from "./../../../models/posts/Post";
import { Auth, IUserRequest } from "../../../middleware/Auth";
import express, { Router, Response } from "express";
import Post from "../../../models/posts/Post";

const router: Router = express.Router();

const editPost = router.post(
  "/edit",
  Auth,
  async (req: IUserRequest, res: Response) => {
    try {
      const { postId, title, body } = req.body;

      if (!postId || !body || !title) {
        return res.status(400).send({
          status: "err",
          msg: "Field 'postId', 'title' and 'body' are required",
        });
      }

      const postToUpdate = await Post.update(
        {
          title: title,
          body: body,
          edited: true,
        },
        {
          where: {
            id: postId,
          },
        }
      );

      if (!postToUpdate) {
        return res.status(500).send({
          status: "err",
          msg: "Could not edit post, post not found",
        });
      }

      res.send({
        status: "ok",
        msg: "Post edited successfully",
        post: {
          title,
          body,
          edited: true,
        },
      });
    } catch (err) {
      res.status(500).send({ err, status: "err" });

      console.log(err);
    }
  }
);

export default editPost;
