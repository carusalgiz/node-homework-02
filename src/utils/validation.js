"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const joi_1 = __importDefault(require("joi"));
const schema = joi_1.default.object({
    login: joi_1.default.string()
        .alphanum()
        .min(6)
        .max(30)
        .required(),
    password: joi_1.default.string()
        .pattern(new RegExp(/\d/))
        .pattern(new RegExp(/[a-zA-Z]/))
        .required(),
    age: joi_1.default.number()
        .min(4)
        .max(130)
        .required()
});
function validate(data) {
    return schema.validate(data, { abortEarly: false });
}
exports.validate = validate;
