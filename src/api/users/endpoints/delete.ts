import express, { Router, Response, Request } from "express";
import User from "../../../models/User";
import Token from "../../../models/Token";

const router: Router = express.Router();

const deleteUser = router.delete("/delete/:id", async (req: Request, res: Response) => {
  /**
   * we first search the user id, if not found json the error
   * if it is found we destroy the token and user
   */
    try {
      const deletedUser = await User.findOne({ where: { id: req.params.id }});
      if (!deletedUser) return res.status(400).json({ error: "Could not delete user" });
      await Token.destroy({ where: { userId: req.params.id }}) && await User.destroy({ where: { id: req.params.id }});
      res.json({ msg: "User deleted successfully", user: req.params.user });
    } catch (e) {
      res.status(500).json({ e });
      console.log(e);
    }
  }
);

export default deleteUser;