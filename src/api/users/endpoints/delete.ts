import { UserAttributesInterface } from "../../../models/users/User";
import { Auth } from "./../../../middleware/Auth";
import express, { Router, Response } from "express";
import { IUserRequest } from "./../../../middleware/Auth";
import User from "../../../models/users/User";
import Token from "../../../models/users/Token";

const router: Router = express.Router();

const deleteUser = router.post(
  "/delete",
  Auth,
  async (req: IUserRequest, res: Response) => {
    try {
      // This doesnt return the deleted user, just if if was deleted or not
      const deletedUser: UserAttributesInterface = (await User.destroy({
        where: {
          id: req.user?.userId,
        },
      })) as unknown as UserAttributesInterface;

      if (!deletedUser)
        return res.status(400).send({ error: "Could not delete user" });

      await Token.destroy({
        where: {
          userId: req.user?.userId,
        },
      });

      res.send({
        status: "ok",
        msg: "User deleted successfully",
      });
    } catch (err) {
      res.status(500).send({ err, status: "err" });

      console.log(err);
    }
  }
);

export default deleteUser;
