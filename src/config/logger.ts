import { createLogger, transports, format } from 'winston';

const logger = createLogger({
    level: 'info',
    format: format.json(),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.timestamp(),
                format.simple(),
                format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}] ${level}: ${message}`;
                }))
        })
    ]
});

export default logger;
