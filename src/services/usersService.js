"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("../utils/utils");
const validation_1 = require("../utils/validation");
const router = express_1.default.Router();
const usersCollection = [];
router.post('/user', (req, res) => {
    const validationResult = (0, validation_1.validate)(req.body);
    if (validationResult.error) {
        const errors = validationResult.error.details.reduce((result, error) => {
            var _a;
            if ((_a = error === null || error === void 0 ? void 0 : error.context) === null || _a === void 0 ? void 0 : _a.key) {
                result[error.context.key] = error.message;
            }
            return result;
        }, {});
        res.status(400).json({
            errorMessage: 'Some fields are filled incorectly. Fix your data and try again',
            errors
        });
    }
    else {
        const userIndex = usersCollection.findIndex(u => u.login === req.body.login);
        if (userIndex < 0) {
            const user = Object.assign({ id: usersCollection.length.toString(), isDeleted: false }, req.body);
            usersCollection.push(user);
            res.json(user);
        }
        else {
            res.status(400).json({
                errorMessage: 'User with a such login has already exists'
            });
        }
    }
});
router.put('/user/:id', (req, res) => {
    const userIndex = usersCollection.findIndex(u => u.id === req.params.id);
    if (userIndex < 0) {
        res.status(404).json({
            errorMessage: `Unable to update a user with id ${req.params.id} because it doesn't exist`
        });
    }
    else {
        const validationResult = (0, validation_1.validate)(req.body);
        if (validationResult.error) {
            const errors = validationResult.error.details.reduce((result, error) => {
                var _a;
                if ((_a = error === null || error === void 0 ? void 0 : error.context) === null || _a === void 0 ? void 0 : _a.key) {
                    result[error.context.key] = error.message;
                }
                return result;
            }, {});
            res.status(400).json({
                errorMessage: 'Some fields are filled incorectly. Fix your data and try again',
                errors
            });
        }
        else {
            const user = usersCollection[userIndex];
            if (req.body.login) {
                user.login = req.body.login;
            }
            if (req.body.password) {
                user.password = req.body.password;
            }
            if (req.body.age) {
                user.age = req.body.age;
            }
            res.json(user);
        }
    }
});
router.get('/user/:id', (req, res) => {
    const user = usersCollection.find(u => u.id === req.params.id);
    if (!user) {
        res.status(404).json({
            errorMessage: `Unable to find a user with id: ${req.params.id}`
        });
    }
    else {
        res.json(user);
    }
});
router.delete('/user/:id', (req, res) => {
    const userIndex = usersCollection.findIndex(u => u.id === req.params.id);
    if (userIndex < 0) {
        res.status(404).json({
            errorMessage: `Unable to find a user with id: ${req.params.id}`
        });
    }
    else {
        const user = usersCollection[userIndex];
        user.isDeleted = true;
        res.json(user);
    }
});
router.get('/getAutoSuggestUsers', (req, res) => {
    let limit = 10;
    let loginSubstring = '';
    if (req.query.limit) {
        limit = +req.query.limit;
    }
    if (!req.query.login) {
        res.status(400).json({
            errorMessage: '"Login" quesry parameter is missed'
        });
    }
    else {
        loginSubstring = req.query.login.toString();
        const sortedUsers = usersCollection.sort((a, b) => (0, utils_1.sorting)(a, b));
        const filteredBySubstring = sortedUsers.filter(user => user.login.includes(loginSubstring));
        res.json({ suggestedUsers: filteredBySubstring.slice(0, limit) });
    }
});
router.get('/', (req, res) => {
    res.json({ users: usersCollection });
});
exports.default = router;
