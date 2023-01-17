import { NextFunction, Request, Response } from 'express';
import { ValidationErrorItem, ValidationResult } from "joi";
import { IErrorType } from "../interfaces/IErrorType";
import { validate } from "../utils/validation";

export default class UserMiddleware {
    constructor() {}
    
    public userValidation(req: Request, res: Response, next: NextFunction): void {
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
            return next();
        }
    }
    
    public userSuggest(req: Request, res: Response, next: NextFunction): void {
        if (!req.query.login) {
            res.status(400).json({
                errorMessage: '"login" query parameter is missed'
            });
        } else if (!req.query.limit) {
            res.status(400).json({
                errorMessage: '"limit" query parameter is missed'
            });
        } else {
            return next();
        }
    }
}