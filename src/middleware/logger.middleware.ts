import { Request, Response } from 'express';
import sequelize from '../config/connection';
import logger from '../config/logger';

export default class LoggerMiddleware {
    public static logRequestData(req: Request): void {
        const parameters = Object.keys(req.query).length ? ` Parameters: ${JSON.stringify(req.query)}` : '';
        const body = Object.keys(req.body).length ? ` Body: ${JSON.stringify(req.body)}` : '';

        logger.info(`${req.method} ${req.url}${parameters}${body}`);
    }

    public unhandledError(req: Request, res: Response): void {
        LoggerMiddleware.logRequestData(req);
        res.status(505).json({
            errorMessage: 'Error appeared while trying to complete request'
        });
    }

    public catchException(error: Error): void {
        logger.error(error?.message || error);
        sequelize.close();
        process.exit(1);
    }
}
