import { ViewsAttributesInterface } from "./../../../models/posts/View";
import { AuthOptional } from "./../../../middleware/AuthOptional";
import express, { Response, Router } from "express";
import { Auth, IUserRequest } from "../../../middleware/Auth";
import catchAsync from "../../../middleware/catchAsync";
import View from "../../../models/posts/View";

const router: Router = express.Router();

const addPostView = router.post(
  "/add",
  AuthOptional,
  catchAsync(async (req: IUserRequest, res: Response) => {
    const { postId } = req.body;

    console.log(postId);

    const view: ViewsAttributesInterface = (await View.create({
      postId: postId,
      userId: req.user?.userId || null,
    })) as unknown as ViewsAttributesInterface;

    res.json({
      status: "ok",
      message: "View added",
    });
  })
);

export default addPostView;
