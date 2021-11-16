import { createLogger, format, Logger, transports } from "winston";

export const logger: Logger = createLogger(
    {
        level: 'info',
        format: format.combine(
            format.timestamp(),
            format.simple()
        ),
        transports: [
            new transports.Console, // by default logs are saved to file
            new transports.File({
                filename: './test.log'
            })
        ]
    }
)