import { Auth, IUserRequest } from "./../../../middleware/Auth";
import express, { Router, Response } from "express";
import Post from "../../../models/Post";

const router: Router = express.Router();

const createPost = router.post(
  "/create_post",
  Auth,
  async (req: IUserRequest, res: Response) => {
    try {
      const { title, body } = req.body;

      if (!title || !body) {
        return res.status(400).send({
          status: "err",
          msg: "'title' and 'body' are required",
        });
      }

      // Define the post here so its accessible outside the if
      let post;

      if (req.user?.userId && req.user.userName) {
        // define the post variable in here so the userid and the name are never undefined
        post = await Post.create({
          title,
          body,
          authorId: req.user?.userId,
          authorName: req.user?.userName,
        });
      } else {
        throw new Error("User credentials undefined");
      }

      if (!post) {
        throw new Error("Could not create post");
      }

      res.send({ status: "ok", msg: "Post created", post });
    } catch (err) {
      res.status(500).send({ err, status: "err" });

      console.log(err);
    }
  }
);

export default createPost;
