import express, { NextFunction, Request, Response } from 'express';
import { ValidationResult, ValidationErrorItem } from 'joi';
import { IErrorType } from '../interfaces/IErrorType';
import { IUser } from '../interfaces/IUser';
import { UserModel } from '../models/User.model';
import UsersService from '../services/usersService';
import { validate } from '../utils/validation';

const router = express.Router();
const usersService = new UsersService(UserModel);

function userValidation(req: Request, res: Response, next: NextFunction): any {
    const validationResult: ValidationResult = validate(req.body);

    if (validationResult.error) {
        const errors = validationResult.error.details.reduce((result: IErrorType, error: ValidationErrorItem) => {
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
        next();
    }   
}

function autoSuggestMiddleware(req: Request, res: Response, next: NextFunction): any {
    if (!req.query.login) {
        res.status(400).json({
            errorMessage: '"login" query parameter is missed'
        });
    } else if (!req.query.limit) {
        res.status(400).json({
            errorMessage: '"limit" query parameter is missed'
        });
    } else {
         next();
    }
}


router.post('/user', userValidation, async (req: Request, res: Response) => {
    try {
        const user = await usersService.create(req.body);
        res.json(user);
    } catch (err) {
        res.status(400).json({
            errorMessage: 'User with a such login has already exists'
        });
    }
});

router.put('/user/:id', userValidation, async (req: Request, res: Response) => {
    try {
        const userDTO: IUser = {
            id: req.params.id,
            ...req.body
        };
        const user = await usersService.update(userDTO);
        res.json(user);
    } catch (err) {
        res.status(404).json({
            errorMessage: `User with id ${req.params.id} doesn't exist`
        });
    }
});

router.get('/user/:id', async (req: Request, res: Response) => {
    const user = await usersService.get(+req.params.id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({
            errorMessage: `Unable to find a user with id: ${req.params.id}`
        });
    }
});

router.delete('/user/:id', async(req: Request, res: Response) => {
    try {
        const user = await usersService.deleteUser(+req.params.id);
        res.json(user);
    } catch (err) {
        res.status(404).json({
            errorMessage: `Unable to find a user with id: ${req.params.id}`
        });
    };
});

router.get('/getAutoSuggestUsers', autoSuggestMiddleware, async (req: Request, res: Response) => {
    try {
        const limit: string = req.query.limit as string;
        const login: string = req.query.login as string;
        
        const users = await usersService.getAutoSuggestUsers(+limit, login);
        res.json({ suggestedUsers: users });
    } catch (error) {
        res.status(500).json({
            errorMessage: 'Error while trying to receive data',
            error
        });
    }
});

router.get('/', async (req: Request, res: Response) => {
    const users = await usersService.getUsers();
    res.json({ users });
});

export default router;
