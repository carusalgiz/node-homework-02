import { NextFunction, Request, Response } from 'express';

const PERMISSIONS = ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'];

export default class GroupMiddleware {
    public groupValidation(req: Request, res: Response, next: NextFunction): void {
        if (!req.body.name) {
            res.status(400).json({
                errorMessage: '"name" attribute is missed'
            });
        } else if (!req.body.permissions || req.body.permissions.length === 0) {
            res.status(400).json({
                errorMessage: '"permissions" attribute is missed or empty'
            });
        } else {
            let permissionsValid = true;
            req.body.permissions.forEach((p: string) => {
                if (!PERMISSIONS.includes(p)) {
                    permissionsValid = false;
                    res.status(400).json({
                        errorMessage: `permission with name "${p}" doesn't exist`
                    });
                }
            });
            if (permissionsValid) {
                return next();
            }
        }
    }
}
