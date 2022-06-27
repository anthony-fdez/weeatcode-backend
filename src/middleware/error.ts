/* eslint-disable @typescript-eslint/no-unused-vars */
import { Response, Request, NextFunction } from "express";
import { ErrorHandler } from "../utils/error/errorHandling";

export = (
  err: ErrorHandler,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  let error = { ...err };
  error.message = err.message;

  //handles sequelize constraint error
  if (err.name === "SequelizeUniqueConstraintError") {
    const message = "Email already in use";
    error = new ErrorHandler(message, 400);
  }

  res.status(error.statusCode).send({
    status: "err",
    message: error.message,
  });
};
