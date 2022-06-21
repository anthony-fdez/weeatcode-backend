import express, { Router, Request, Response } from "express";

const router: Router = express.Router();

const signup = router.post("/signup", async (req: Request, res: Response) => {
  try {
    res.send("OK");
  } catch (e: any) {
    res.status(500).send(e.toString());
  }
});

export default signup;
