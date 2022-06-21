import express, { Router, Request, Response } from "express";

const router: Router = express.Router();

const logout = router.post("/logout", async (req: Request, res: Response) => {
  try {
    res.send("OK");
  } catch (e) {
    res.status(500).send({ e });
  }
});

export default logout;
