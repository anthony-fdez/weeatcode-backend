"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./api/users/users"));
const logger_1 = require("../config/logger");
const app = (0, express_1.default)();
const PORT = 3001;
app.use(users_1.default);
const server = app.listen(PORT, () => {
    logger_1.logger.log({
        level: 'info',
        message: `listening on port: ${PORT}`
    });
    process.on('unhandledRejection', (err) => {
        logger_1.logger.log({
            level: 'error',
            message: `server shutting down due to unhandled rejection: ${err.stack}`
        });
        server.close(() => {
            process.exit(1);
        });
    });
});
