import { Auth } from "./../../../middleware/Auth";
import express, { Router, Request, Response } from "express";
import { IUserRequest } from "./../../../middleware/Auth";

const router: Router = express.Router();

const deleteUser = router.post(
  "/delete",
  Auth,
  async (req: IUserRequest, res: Response) => {
    try {
      res.send({ data: req.user });
    } catch (e) {
      res.status(500).send({ e });
    }
  }
);

export default deleteUser;
