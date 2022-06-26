import express, { Router } from "express";
import signup from "./endpoints/signup";
import login from "./endpoints/login";
import deleteUser from "./endpoints/delete";
import logout from "./endpoints/logout";
import logoutAll from "./endpoints/logoutAll";

const usersRouter: Router = express.Router();

usersRouter.use("/users", signup);
usersRouter.use("/users", deleteUser);
usersRouter.use("/users", login);
// usersRouter.use('/users', logout);
// usersRouter.use('/users', logoutAll);

export default usersRouter;
