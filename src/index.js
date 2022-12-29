"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersService_1 = __importDefault(require("./services/usersService"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.listen(3000, () => {
    console.log('[server]: Server is running at https://localhost:3000');
});
app.use('/users', usersService_1.default);
