import express from "express";
import { Router } from "express";
import createPost from "./crud/createPost";
import deletePost from "./crud/deletePost";
import editPost from "./crud/editPost";
import getAllPosts from "./crud/getAllPosts";
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

// Post votes
postsRouter.use("/posts", postUpvote);
postsRouter.use("/posts", postDownvote);

export default postsRouter;
