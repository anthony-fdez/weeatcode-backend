import { Auth } from "./../../../middleware/Auth";
import express, { Router, Response } from "express";
import { IUserRequest } from "./../../../middleware/Auth";
import User from "../../../models/User";
import Token from "../../../models/Token";

const router: Router = express.Router();

const deleteUser = router.post(
  "/delete",
  Auth,
  async (req: IUserRequest, res: Response) => {
    try {
      const deletedUser = await User.destroy({
        where: {
          id: req.user?.userId,
        },
      });

      if (!deletedUser)
        return res.status(400).send({ error: "Could not delete user" });

      await Token.destroy({
        where: {
          userId: req.user?.userId,
        },
      });

      res.send({ msg: "User deleted successfully", user: req.user });
    } catch (e) {
      res.status(500).send({ e });
    }
  }
);

export default deleteUser;
