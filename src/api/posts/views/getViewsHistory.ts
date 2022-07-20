import { ViewsAttributesInterface } from "./../../../models/posts/View";
import { Auth } from "./../../../middleware/Auth";
import express, { Response, Router } from "express";
import { IUserRequest } from "../../../middleware/Auth";
import catchAsync from "../../../middleware/catchAsync";
import View from "../../../models/posts/View";
import Post from "../../../models/posts/Post";

const router: Router = express.Router();

const getViewsHistory = router.get(
  "/get",
  Auth,
  catchAsync(async (req: IUserRequest, res: Response) => {
    const views: ViewsAttributesInterface[] = (await View.findAll({
      where: {
        userId: req.user?.userId,
      },

      include: {
        model: Post,
      },
    })) as unknown as ViewsAttributesInterface[];

    const parsedViews: any = [];

    views.forEach((view, index) => {
      console.log(view);
      parsedViews.push({
        // @ts-ignore
        view: view.dataValues,
        // @ts-ignore
        post: view.Post,
      });
    });

    res.json({
      status: "ok",
      views: parsedViews,
    });
  })
);

export default getViewsHistory;
