import { Auth, IUserRequest } from "./../../../middleware/Auth";
import express, { Router, Response } from "express";

const router: Router = express.Router();

const editPost = router.post(
  "/edit_post",
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

export default editPost;
