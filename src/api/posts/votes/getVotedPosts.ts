import { ViewsAttributesInterface } from "./../../../models/posts/View";
import { Auth } from "./../../../middleware/Auth";
import express, { Response, Router } from "express";
import { IUserRequest } from "../../../middleware/Auth";
import catchAsync from "../../../middleware/catchAsync";
import View from "../../../models/posts/View";
import Post from "../../../models/posts/Post";
import PostVote, {
  PostVoteAttributesInterface,
} from "../../../models/posts/PostVote";

const router: Router = express.Router();

const getVotesHistory = router.get(
  "/get",
  Auth,
  catchAsync(async (req: IUserRequest, res: Response) => {
    const votedPosts: PostVoteAttributesInterface[] = (await PostVote.findAll({
      where: {
        userId: req.user?.userId,
      },
      include: [
        {
          model: Post,
          include: [{ model: PostVote, as: "votes" }],
        },
      ],
    })) as unknown as PostVoteAttributesInterface[];

    const parsedVotedPosts: any = [];

    votedPosts.forEach((vote, index) => {
      let upVotes = 0;
      let upVoted = false;

      let downVotes = 0;
      let downVoted = false;

      // @ts-ignore
      vote.Post.votes.forEach((vote: PostVoteAttributesInterface) => {
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

      parsedVotedPosts.push({
        voteScore: upVotes - downVotes,
        upVotes,
        downVotes,
        upVoted,
        downVoted,
        // @ts-ignore
        vote: vote.dataValues,
        // @ts-ignore
        post: vote.Post,
      });
    });

    res.json({
      status: "ok",
      votedPosts: parsedVotedPosts,
    });
  })
);

export default getVotesHistory;
