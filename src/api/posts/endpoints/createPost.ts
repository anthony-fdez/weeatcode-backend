import { Auth, IUserRequest } from "./../../../middleware/Auth";
import express, { Router, Response } from "express";
import Post from "../../../models/Post";

const router: Router = express.Router();

const createPost = router.post(
  "/create_post",
  Auth,
  async (req: IUserRequest, res: Response) => {
    try {
      res.send({ user: req.user });
    } catch (err) {
      res.status(500).send({ err, status: "err" });

      console.log(err);
    }
  }
);

export default createPost;
