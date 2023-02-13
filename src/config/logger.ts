import { createLogger, transports, format } from 'winston';

const logger = createLogger({
    level: 'info',
    format: format.json(),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple(),
                format.printf(({ level, message }) => {
                    return `${level}: ${message}`;
                }))
        })
    ]
});

export default logger;
