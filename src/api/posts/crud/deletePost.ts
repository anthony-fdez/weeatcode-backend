import { Auth, IUserRequest } from "./../../../middleware/Auth";
import express, { Router, Response } from "express";
import Post from "../../../models/posts/Post";

const router: Router = express.Router();

const deletePost = router.post(
  "/delete",
  Auth,
  async (req: IUserRequest, res: Response) => {
    try {
      // The posts are deleted by their post id

      const { postId } = req.body;

      if (!postId) {
        return res.status(400).send({
          status: "err",
          msg: "Field 'postId' is required",
        });
      }

      const deletedPost = await Post.destroy({
        where: {
          id: postId,
        },
      });

      // remove votes from db
      // remove comments from db

      if (!deletedPost) {
        return res.status(500).send({
          status: "err",
          msg: "Could not delete post",
        });
      }

      res.send({
        status: "ok",
        msg: "Post deleted successfully",
      });
    } catch (err) {
      res.status(500).send({ err, status: "err" });

      console.log(err);
    }
  }
);

export default deletePost;
