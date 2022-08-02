import express, { Response, Router } from "express";
import { Auth, IUserRequest } from "../../../middleware/Auth";
import catchAsync from "../../../middleware/catchAsync";

const router: Router = express.Router();

const getById = router.post(
  "/get_by_id",
  Auth,
  catchAsync(async (req: IUserRequest, res: Response) => {
    res.json({
      status: "ok",
    });
  })
);

export default getById;
