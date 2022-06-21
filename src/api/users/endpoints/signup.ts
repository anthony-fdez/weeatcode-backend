import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
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

    res.send({ data: hashedPassword });
  } catch (e: any) {
    console.log(e);
    res.status(500).send({ error: e.message });
  }
});

interface HashPasswordInterface {
  textPassword: string;
}

interface CompareHashPasswordInterface {
  textPassword: string;
  hash: string;
}

const hashPassword = async ({ textPassword }: HashPasswordInterface) => {
  const saltRounds = 10;

  const hashedPassword = await bcrypt.hash(textPassword, saltRounds);

  return hashedPassword;
};

const compareHashedPassword = async ({
  textPassword,
  hash,
}: CompareHashPasswordInterface) => {
  const isMatch = await bcrypt.compare(textPassword, hash);

  return isMatch;
};

export default signup;
