import express, { Router, Request, Response } from "express";

// Endpoints
import signup from "./endpoints/signup";

const usersRouter: Router = express.Router();

usersRouter.use(signup);

export default usersRouter;
