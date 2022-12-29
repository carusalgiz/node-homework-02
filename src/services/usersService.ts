import express, { Request, Response } from 'express';
import { ValidationResult, ValidationErrorItem } from 'joi';
import { ErrorType } from '../models/errorType';
import { User } from '../models/User';
import { sorting } from '../utils/utils';
import { validate } from '../utils/validation';

const router = express.Router();
const usersCollection: User[] = [];

router.post('/user', (req: Request, res: Response) => {
    const validationResult: ValidationResult = validate(req.body);

    if (validationResult.error) {
        const errors = validationResult.error.details.reduce((result: ErrorType, error: ValidationErrorItem) => {
            if (error?.context?.key) {
                result[error.context.key] = error.message;
            }
            return result;
        }, {});
        res.status(400).json({
            errorMessage: 'Some fields are filled incorectly. Fix your data and try again',
            errors
        });
    } else {
        const userIndex = usersCollection.findIndex(u => u.login === req.body.login);
        if (userIndex < 0) {
            const user: User = {
                id: usersCollection.length.toString(),
                isDeleted: false,
                ...req.body
            };
            usersCollection.push(user);
            res.json(user);
        } else {
            res.status(400).json({
                errorMessage: 'User with a such login has already exists'
            });
        }
    }
});

router.put('/user/:id', (req: Request, res: Response) => {
    const userIndex = usersCollection.findIndex(u => u.id === req.params.id);

    if (userIndex < 0) {
        res.status(404).json({
            errorMessage: `Unable to update a user with id ${req.params.id} because it doesn't exist`
        });
    } else {
        const validationResult: ValidationResult = validate(req.body);

        if (validationResult.error) {
            const errors = validationResult.error.details.reduce((result: ErrorType, error: ValidationErrorItem) => {
                if (error?.context?.key) {
                    result[error.context.key] = error.message;
                }
                return result;
            }, {});
            res.status(400).json({
                errorMessage: 'Some fields are filled incorectly. Fix your data and try again',
                errors
            });
        } else {
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

router.get('/user/:id', (req: Request, res: Response) => {
    const user = usersCollection.find(u => u.id === req.params.id);
    if (!user) {
        res.status(404).json({
            errorMessage: `Unable to find a user with id: ${req.params.id}`
        });
    } else {
        res.json(user);
    }
});

router.delete('/user/:id', (req: Request, res: Response) => {
    const userIndex = usersCollection.findIndex(u => u.id === req.params.id);
    if (userIndex < 0) {
        res.status(404).json({
            errorMessage: `Unable to find a user with id: ${req.params.id}`
        });
    } else {
        const user = usersCollection[userIndex];
        user.isDeleted = true;
        res.json(user);
    }
});

router.get('/getAutoSuggestUsers', (req: Request, res: Response) => {
    let limit = 10;
    let loginSubstring = '';

    if (req.query.limit) {
        limit = +req.query.limit;
    }
    if (!req.query.login) {
        res.status(400).json({
            errorMessage: '"Login" quesry parameter is missed'
        });
    } else {
        loginSubstring = req.query.login.toString();
        const sortedUsers =
            usersCollection.sort((a, b) => sorting(a, b));
        const filteredBySubstring =
            sortedUsers.filter(user => user.login.includes(loginSubstring));
        res.json({ suggestedUsers: filteredBySubstring.slice(0, limit) });
    }
});

router.get('/', (req: Request, res: Response) => {
    res.json({ users: usersCollection });
});

export default router;
