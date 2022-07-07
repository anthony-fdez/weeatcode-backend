import express from "express";
import { Router } from "express";
import createComment from "./comments/createComment";
import deleteComment from "./comments/deleteComment";
import editComment from "./comments/editComment";
import createPost from "./crud/createPost";
import deletePost from "./crud/deletePost";
import editPost from "./crud/editPost";
import getAllPosts from "./crud/getAllPosts";
import getById from "./crud/getById";
import searchPosts from "./search/searchPosts";
import postDownvote from "./votes/downvote";
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

// Post comments
postsRouter.use("/posts/comment/", createComment);
postsRouter.use("/posts/comment/", deleteComment);
postsRouter.use("/posts/comment/", editComment);

export default postsRouter;
