import { ViewsAttributesInterface } from "./../../../models/posts/View";
import { Auth } from "./../../../middleware/Auth";
import express, { Response, Router } from "express";
import { IUserRequest } from "../../../middleware/Auth";
import catchAsync from "../../../middleware/catchAsync";
import View from "../../../models/posts/View";
import Post from "../../../models/posts/Post";
import PostVote from "../../../models/posts/PostVote";

const router: Router = express.Router();

const getViewsHistory = router.get(
  "/get",
  Auth,
  catchAsync(async (req: IUserRequest, res: Response) => {
    const views: ViewsAttributesInterface[] = (await View.findAll({
      where: {
        userId: req.user?.userId,
      },

      include: [
        {
          model: Post,
          include: [{ model: PostVote, as: "votes" }],
        },
      ],
    })) as unknown as ViewsAttributesInterface[];

    const parsedViews: any = [];

    views.forEach((view, index) => {
      let upVotes = 0;
      let upVoted = false;

      let downVotes = 0;
      let downVoted = false;

      // @ts-ignore
      view.Post.votes.forEach((vote: PostVoteAttributesInterface) => {
        if (vote.upvote) {
          upVotes++;

          if (vote.userId === req.user?.userId) {
            upVoted = true;
          }
        } else if (vote.downvote) {
          downVotes++;

          if (vote.userId === req.user?.userId) {
            downVoted = true;
          }
        }
      });

      parsedViews.push({
        voteScore: upVotes - downVotes,
        upVotes,
        downVotes,
        upVoted,
        downVoted,
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
