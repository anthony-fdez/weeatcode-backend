import { compareHashedPassword } from "./../helpers/passwords";
import { query } from "./../../../db/db";
import express, { Router, Request, Response } from "express";

const router: Router = express.Router();

interface LoginInterface {
  email: string;
  password: string;
}

const login = router.post("/login", async (req: Request, res: Response) => {
  try {
    if (!req.body.password) throw new Error("Field 'password' required");
    if (!req.body.email) throw new Error("Field 'email' is required.");

    const userInfo: LoginInterface = {
      email: req.body.email,
      password: req.body.password,
    };

    const sql = `SELECT password FROM users WHERE email = '${userInfo.email}'`;

    const result = await query({ sql, res });

    if (result) {
      if (result.rowCount === 0) {
        // Send invalid email even if the email doesn't exist
        // so that people don't know the email exists
        return res.send({ err: "Invalid 'email' or 'password'" });
      }

      const passwordsMatch = await compareHashedPassword({
        textPassword: userInfo.password,
        hash: result.rows[0].password,
      });

      if (!passwordsMatch) {
        return res.send({ err: "Invalid 'email' or 'password'" });
      }

      res.send({
        msg: "Logged in successfully",
      });
    }
  } catch (e) {
    res.status(500).send({ e });
  }
});

export default login;
