import { Response, Request } from "express";
import { ErrorHandler } from "../utils/error/errorHandling";

export = (err: ErrorHandler, _req: Request, res: Response): void => {
    err.statusCode = err.statusCode || 500;
    let error =  { ...err };
    error.message = err.message;

    //handles sequelize constraint error
    if(err.name === "SequelizeUniqueConstraintError"){
        const message = "Email already in use";
        error = new ErrorHandler(message, 400);
    }
    
   res.status(error.statusCode).send({
    status: "error",
    message: error.message
   })
}