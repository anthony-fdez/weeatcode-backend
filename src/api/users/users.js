"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Endpoints
const signup_1 = __importDefault(require("./endpoints/signup"));
const delete_1 = __importDefault(require("./endpoints/delete"));
const login_1 = __importDefault(require("./endpoints/login"));
const logout_1 = __importDefault(require("./endpoints/logout"));
const logoutAll_1 = __importDefault(require("./endpoints/logoutAll"));
const usersRouter = express_1.default.Router();
usersRouter.use("/users", signup_1.default);
usersRouter.use("/users", delete_1.default);
usersRouter.use("/users", login_1.default);
usersRouter.use("/users", logout_1.default);
usersRouter.use("/users", logoutAll_1.default);
exports.default = usersRouter;
