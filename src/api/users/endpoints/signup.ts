import express, { Router, Request, Response } from "express";

const router: Router = express.Router();

const signup = router.post("/signup", async (req: Request, res: Response) => {
  try {
    res.send("OK");
  } catch (e) {
    res.status(500).send({ e });
  }
});

export default signup;
