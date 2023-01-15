"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersController_1 = __importDefault(require("./controllers/usersController"));
const pg = __importStar(require("pg"));
const sequelize_typescript_1 = require("sequelize-typescript");
const fs_1 = require("fs");
const User_model_1 = require("./models/User.model");
const app = (0, express_1.default)();
const sequelize = new sequelize_typescript_1.Sequelize('postgres://postgres:289824@localhost:5432/homework_db', {
    dialectModule: pg,
    dialectOptions: {
        multipleStatements: true
    },
    models: [User_model_1.UserModel]
});
function tableInit() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sql = yield fs_1.promises.readFile('src/db_init.sql', 'utf8');
            yield sequelize.query(sql);
        }
        catch (err) {
            console.log(err);
        }
    });
}
app.use(express_1.default.json());
function checkDBconnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield sequelize.authenticate();
            console.log('Connection has been established successfully.');
            yield tableInit();
            console.log('Initial data setted.');
        }
        catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    });
}
app.listen(3000, () => {
    checkDBconnection();
    console.log('[server]: Server is running at https://localhost:3000');
});
app.use('/users', usersController_1.default);
