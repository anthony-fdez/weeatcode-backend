import express, { Router } from "express";
import signup from "./endpoints/signup";
import login from "./endpoints/login";
import deleteUser from "./endpoints/delete";
import logout from "./endpoints/logout";
import logoutAll from "./endpoints/logoutAll";
import getUserData from "./endpoints/getUserData";
import getFollowers from "./follow/getFollowers";
import follow from "./follow/follow";

const usersRouter: Router = express.Router();

usersRouter.use("/users", signup);
usersRouter.use("/users", deleteUser);
usersRouter.use("/users", login);
usersRouter.use("/users", logout);
usersRouter.use("/users", logoutAll);
usersRouter.use("/users", getUserData);

// Followers
usersRouter.use("/users", getFollowers);
usersRouter.use("/users", follow);

export default usersRouter;
