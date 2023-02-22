import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { config } from "../config/config";

export default class AuthMiddleware {
    public loginValidatiion(req: Request, res: Response, next: NextFunction): void {
        if (!req.body.login) {
            res.status(400).json({
                errorMessage: '"login" parameter is missed'
            });
        } else if (!req.body.password) {
            res.status(400).json({
                errorMessage: '"password" parameter is missed'
            });
        } else {
            return next();
        }
    }

    public checkToken(req: Request, res: Response, next: NextFunction): void {
        const token = req.headers['x-access-token'] as string;
        if (!token) {
            res.status(401).send({ errorMessage: 'Token not provided' });
        } else {
            jwt.verify(token, config.secret, (error) => {
                if (error) {
                    res.status(403).send({ errorMessage: 'Token is invalid' });
                } else {
                    return next();
                }
            });
        }
    }
}
