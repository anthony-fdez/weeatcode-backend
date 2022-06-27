import { Auth, IUserRequest } from "../../../middleware/Auth";
import express, { Router, Response } from "express";

const router: Router = express.Router();

const searchPosts = router.post(
  "/search_posts",
  Auth,
  async (req: IUserRequest, res: Response) => {
    try {
      res.send("ok");
    } catch (err) {
      res.status(500).send({ err, status: "err" });

      console.log(err);
    }
  }
);

export default searchPosts;
