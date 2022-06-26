import { Auth, IUserRequest } from "./../../../middleware/Auth";
import express, { Router, Request, Response } from "express";
import Token from "../../../models/Token";

const router: Router = express.Router();

const logout = router.post(
  "/logout",
  Auth,
  async (req: IUserRequest, res: Response) => {
    try {
      await Token.destroy({ where: { token: req.user?.token } });

      res.send({
        status: "ok",
        msg: "Logged out successfully",
      });
    } catch (err) {
      res.status(500).send({
        status: "err",
        err,
      });
    }
  }
);

export default logout;
