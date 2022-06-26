import express from "express";
import { Router } from "express";
import createPost from "./endpoints/createPost";
import deletePost from "./endpoints/deletePost";
import editPost from "./endpoints/editPost";
import getAllPosts from "./endpoints/getAllPosts";
import searchPosts from "./endpoints/searchPosts";

const postsRouter: Router = express.Router();

postsRouter.use("/posts", createPost);
postsRouter.use("/posts", deletePost);
postsRouter.use("/posts", editPost);
postsRouter.use("/posts", searchPosts);
postsRouter.use("/posts", getAllPosts);

export default postsRouter;
