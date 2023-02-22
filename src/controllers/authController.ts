import { Request, Response } from 'express';
import AuthMiddleware from "../middleware/auth.middleware";
import router from "./userController";
import UserService from '../services/userService';
import { UserModel } from '../models/User.model';
import { UserGroupModel } from '../models/UserGroup.model';
import LoggerMiddleware from '../middleware/logger.middleware';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

const usersService = new UserService(UserModel, UserGroupModel);
const authMiddleware = new AuthMiddleware();

router.post('/login', authMiddleware.loginValidatiion, async (req: Request, res: Response) => {
    const ERROR_MSG = 'Failure login attempt. Please check your credentials and try again';

    try {
        const user = await usersService.getUserByLogin(req.body.login);
        if (user && user.password === req.body.password && !user.isDeleted) {
            const payload = { sub: user.id, login: user.login };
            const token = jwt.sign(payload, config.secret, { expiresIn: 120 });

            res.send({ token });
        } else {
            throw new Error(ERROR_MSG);
        }
    } catch (err) {
        LoggerMiddleware.logRequestData(req);
        res.status(401).json({
            errorMessage: ERROR_MSG
        });
    }
});

export default router;
