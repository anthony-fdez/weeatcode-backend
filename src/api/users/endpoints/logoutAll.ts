import { Auth, IUserRequest } from "./../../../middleware/Auth";
import express, { Router, Response } from "express";
import Token from "../../../models/users/Token";

const router: Router = express.Router();

const logoutAll = router.post(
  "/logout_all",
  Auth,
  async (req: IUserRequest, res: Response) => {
    try {
      await Token.destroy({
        where: {
          userId: req.user?.userId,
        },
      });

      res.send({
        status: "ok",
        msg: "Logged out all sessions",
      });
    } catch (err) {
      res.status(500).send({
        status: "err",
        err,
      });
    }
  }
);

export default logoutAll;
