import { generateToken } from "./../helpers/jwt";
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

    const sql = `SELECT password, id FROM users WHERE email = '${userInfo.email}'`;

    const { result, err } = await query({ sql });

    if (err) return res.status(400).send({ err });

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

      const token = generateToken({
        email: userInfo.email,
        userId: result.rows[0].id,
      });

      const tokenSql = `INSERT INTO tokens (user_id, token) VALUES (${result.rows[0].id}, '${token}')`;

      // dont wait for the token to be stored in the db
      // this will make the request take twice as long and the user will get the
      // token anyway
      query({ sql: tokenSql });

      return res.send({
        msg: "Logged in successfully",
        token,
      });
    }
  } catch (e) {
    res.status(500).send({ e });
  }
});

export default login;
