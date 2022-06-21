"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const moment_1 = __importDefault(require("moment"));
const logTransports = [
    new winston_1.transports.File({
        level: 'error',
        filename: `./logs/${(0, moment_1.default)().format('DD-MMM-YYYY')}/Activity-${(0, moment_1.default)().format('hha')}.log`,
        format: winston_1.format.json({
            replacer: (key, value) => {
                if (key === 'error') {
                    return {
                        message: value.message,
                        stack: value.stack
                    };
                }
                return value;
            }
        })
    }),
    new winston_1.transports.Console({
        level: 'debug',
        format: winston_1.format.prettyPrint()
    }),
    new winston_1.transports.File({
        level: 'info',
        filename: `./logs/${(0, moment_1.default)().format('DD-MMM-YYYY')}/Activity-${(0, moment_1.default)().format('hha')}.log`,
        format: winston_1.format.prettyPrint()
    })
];
exports.logger = (0, winston_1.createLogger)({
    format: winston_1.format.combine(winston_1.format.timestamp()),
    transports: logTransports,
    defaultMeta: { service: 'api' }
});
