import express from "express";
import { Router } from "express";
import createPost from "./crud/createPost";
import deletePost from "./crud/deletePost";
import editPost from "./crud/editPost";
import getAllPosts from "./crud/getAllPosts";
import searchPosts from "./search/searchPosts";

const postsRouter: Router = express.Router();

postsRouter.use("/posts", createPost);
postsRouter.use("/posts", deletePost);
postsRouter.use("/posts", editPost);
postsRouter.use("/posts", searchPosts);
postsRouter.use("/posts", getAllPosts);

export default postsRouter;
