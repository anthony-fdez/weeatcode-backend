import express, { Router, Request, Response } from "express";

const router: Router = express.Router();

const deleteUser = router.post(
  "/delete",
  async (req: Request, res: Response) => {
    try {
      res.send("OK");
    } catch (e) {
      res.status(500).send({ e });
    }
  }
);

export default deleteUser;
