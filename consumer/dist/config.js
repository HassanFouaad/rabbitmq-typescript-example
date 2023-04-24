"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOTIFICATION_QUEUE = exports.rmqhost = exports.rmqPass = exports.rmqUser = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.rmqUser = String(process.env.RABBITMQ_USERNAME);
exports.rmqPass = String(process.env.RABBITMQ_PASSWORD);
exports.rmqhost = String(process.env.RABBITMQ_URL);
exports.NOTIFICATION_QUEUE = "@notification";
