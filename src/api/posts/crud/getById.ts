import { Auth, IUserRequest } from "../../../middleware/Auth";
import express, { Router, Response, raw } from "express";
import catchAsync from "../../../middleware/catchAsync";
import Post from "../../../models/posts/Post";
import PostVote from "../../../models/posts/PostVote";
import db from "../../../db/db";

const router: Router = express.Router();

const getAllPosts = router.get(
  "/get_all",
  Auth,
  catchAsync(async (req: IUserRequest, res: Response) => {
    res.json("ok");
  })
);

export default getAllPosts;
