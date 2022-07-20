import express from "express";
import { Router } from "express";
import createComment from "./comments/createComment";
import deleteComment from "./comments/deleteComment";
import editComment from "./comments/editComment";
import getComments from "./comments/getPostComments";
import commentDownvote from "./comments/votes/downvoteComment";
import commentUpvote from "./comments/votes/upvoteComment";
import createPost from "./crud/createPost";
import deletePost from "./crud/deletePost";
import editPost from "./crud/editPost";
import getAllPosts from "./crud/getAllPosts";
import getById from "./crud/getById";
import searchPosts from "./search/searchPosts";
import addPostView from "./views/addView";
import getViewsHistory from "./views/getViewsHistory";
import postDownvote from "./votes/downvote";
import getVotesHistory from "./votes/getVotedPosts";
import postUpvote from "./votes/upvote";

const postsRouter: Router = express.Router();

// Crud
postsRouter.use("/posts", createPost);
postsRouter.use("/posts", deletePost);
postsRouter.use("/posts", editPost);
postsRouter.use("/posts", searchPosts);
postsRouter.use("/posts", getAllPosts);
postsRouter.use("/posts", getById);

// Post votes
postsRouter.use("/posts", postUpvote);
postsRouter.use("/posts", postDownvote);
postsRouter.use("/posts/votes", getVotesHistory);

// Post comments
postsRouter.use("/posts/comment/", createComment);
postsRouter.use("/posts/comment/", deleteComment);
postsRouter.use("/posts/comment/", editComment);
postsRouter.use("/posts/comment/", getComments);
postsRouter.use("/posts/comment/", commentDownvote);
postsRouter.use("/posts/comment/", commentUpvote);

// Views
postsRouter.use("/posts/views/", addPostView);
postsRouter.use("/posts/views/", getViewsHistory);

export default postsRouter;
