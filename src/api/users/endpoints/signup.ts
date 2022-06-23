import { generateToken } from "./../helpers/jwt";
import { logger } from "./../../../../config/logger";
import { query } from "./../../../db/db";
import { hashPassword } from "./../helpers/passwords";
import express, { Router, Request, Response } from "express";
import validator from "validator";

const router: Router = express.Router();

interface SignupReqInterface {
  name: string;
  password: string;
  email: string;
}

const signup = router.post("/signup", async (req: Request, res: Response) => {
  try {
    if (!req.body.password) throw new Error("Field 'password' required");
    if (!req.body.email) throw new Error("Field 'email' is required.");
    if (!req.body.name) throw new Error("Field 'name' is required");

    const userInfo: SignupReqInterface = {
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
    };

    if (!validator.isEmail(userInfo.email))
      throw new Error("Invalid 'email' recieved");

    const hashedPassword = await hashPassword({
      textPassword: userInfo.password,
    });

    const sql = `INSERT INTO 
    users(name, email, password) VALUES 
    ('${userInfo.name}', '${userInfo.email}', '${hashedPassword}')
    RETURNING name, email, password, id`;

    const result = await query({ sql, res });

    if (result) {
      logger.log({
        level: "info",
        message: "User Created",
        userInfo: result.rows,
      });

      const token = generateToken({
        email: userInfo.email,
        userId: result.rows[0].id,
      });

      const tokenSql = `INSERT INTO tokens (user_id, token) VALUES (${result.rows[0].id}, '${token}')`;

      const tokenResult = await query({ sql: tokenSql, res });

      if (tokenResult) {
        return res.send({ msg: "User Created", data: result.rows, token });
      }
    }
  } catch (e: any) {
    console.log(e);
    res.status(400).send({ error: e });
  }
});

export default signup;
