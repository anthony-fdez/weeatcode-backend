/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { urlencoded } from "express";

// Routers
import usersRouter from "./api/users/users";
import postsRouter from "./api/posts/posts";
import error from "./middleware/error";

// Export the app so we can use it it the tests
const app = express();

app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(usersRouter);
app.use(postsRouter);
app.use(error);

export default app;
