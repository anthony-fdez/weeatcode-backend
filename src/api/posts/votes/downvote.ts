import { Auth, IUserRequest } from "../../../middleware/Auth";
import express, { Router, Response } from "express";

const router: Router = express.Router();

const postDownvote = router.post(
  "/downvote",
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

export default postDownvote;
