import { query } from "./../../../db/db";
import { Auth } from "./../../../middleware/Auth";
import express, { Router, Response } from "express";
import { IUserRequest } from "./../../../middleware/Auth";

const router: Router = express.Router();

const deleteUser = router.post(
  "/delete",
  Auth,
  async (req: IUserRequest, res: Response) => {
    try {
      const sql = `WITH deleted AS (DELETE FROM users WHERE id = ${req.user?.userId} RETURNING *) SELECT count(*) FROM deleted`;

      const result = await query({ sql, res });

      if (result) {
        // Needs to be double equal and not === (tripple), the response is a string or a number
        // double equals handles both cases since it doesn't check type
        if (result.rows[0].count == 0) {
          return res.status(404).send({ err: "User not found" });
        }

        res.send({ msg: "User deleted successfully", user: req.user });
      }
    } catch (e) {
      res.status(500).send({ e });
    }
  }
);

export default deleteUser;
